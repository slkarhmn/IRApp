/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from 'react-router-dom';
import "../../styles/patientDetail.css"
import { useEffect, useState } from 'react';
import { AddProcedureModal } from '../procedures/addProcedureModal';
import { AddChecklistDropdown } from '../procedures/Addchecklistdropdown';
import { PreProceduralPlanningModal } from '../procedures/planning';
import { SignInModal } from '../procedures/Signinmodal';
import { SignOutModal } from '../procedures/Signoutmodal';
//@ts-expect-error fuck ts
import {patientService} from "../../services/patientService"
//@ts-expect-error fuck ts
import {procedureService} from "../../services/procedures"
//@ts-expect-error fuck ts
import {checklistService} from "../../services/checklists"

interface Checklist {
  id: string;
  type: 'planning' | 'signin' | 'signout';
  name: string;
  date: string;
  items: string[];
}

interface ProcedureWithDetails {
  id: number;
  date: string;
  name: string;
  code: string;
  physician: string;
  status: string;
  checklists: Checklist[];
}


interface Patient {
  id: number;
  mrn: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  phone: string;
  insurance: boolean;
  allergies: string;  
  medications: string;
  medical_history: string;
  blood_pressure_systolic: string;
  blood_pressure_diastolic: string;
  heart_rate_bpm: number;
  temperature_celsius: number;
  respiratory_rate_breaths_per_min: number;
  oxygen_saturation_percent: number;
  weight_kg: number;
  height_cm: number;
  hemoglobin_gL: number;
  hematocrit_LL: number;
  platelet_count: string;
  white_blood_cell_count: string;
  creatinine: string;
  bun_mmolL: number;
  glucose_mmolL: number;
  inr: number;
  pt_seconds: number;
  ptt_seconds: number;
}

const PatientDetail = () => {
  const { id } = useParams();
  const [showPrModal, setShowPrModal] = useState(false);
  const [activeChecklistModal, setActiveChecklistModal] = useState<string | null>(null);
  const [expandedProcedures, setExpandedProcedures] = useState<number[]>([]); 
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [procedures, setProcedures] = useState<ProcedureWithDetails[]>([]);
  const [activeProcedureId, setActiveProcedureId] = useState<number | null>(null); // ← ADD THIS

  // fetch patient data
  useEffect(() => {
    const fetchPatient = async ()=>{
      try {
        const response = await patientService.getPatient(id)
        setPatient(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching patient:', error);
        setLoading(false)
      }
    }
  
    fetchPatient()
  }, [id])

  // fetch checklist for procedure
  const fetchChecklistForProcedure = async (procedureId: number) => {
      
      try {
          const [planningResponse, signInResponse, signOutResponse] = await Promise.all([
              checklistService.getProcedurePlanningByProcedure(procedureId).catch(() => ({ data: null })),
              checklistService.getSignInByProcedure(procedureId).catch(() => ({ data: null })),
              checklistService.getSignOutByProcedure(procedureId).catch(() => ({ data: null }))
          ]);

          const checklists: Checklist[] = [];

          if (planningResponse.data) {
              const planning = planningResponse.data;
              checklists.push({
                  id: `planning-${planning.id}`,
                  type: 'planning',
                  name: 'Pre-Procedural Planning',
                  date: new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                  }),
                  items: [
                      planning.discussed_with_referring_physician && 'Discussed with referring physician',
                      planning.imaging_studies_reviewed && 'Imaging studies reviewed',
                      planning.informed_consent && 'Informed consent obtained',
                      planning.relevant_medical_history && 'Medical history documented'
                  ].filter(Boolean) as string[]
              });
          }

          if (signInResponse.data) {
              const signIn = signInResponse.data;
              checklists.push({
                  id: `signin-${signIn.id}`,
                  type: 'signin',
                  name: 'Sign In',
                  date: new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                  }),
                  items: [
                      signIn.correct_patient && 'Correct patient verified',
                      signIn.correct_site && 'Correct site verified',
                      signIn.allergies_checked && 'Allergies checked'
                  ].filter(Boolean) as string[]
              });
          }

          if (signOutResponse.data) {
              const signOut = signOutResponse.data;
              checklists.push({
                  id: `signout-${signOut.id}`,
                  type: 'signout',
                  name: 'Sign Out',
                  date: new Date().toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                  }),
                  items: [
                      signOut.vital_signs_normal && 'Vital signs normal',
                      signOut.samples_labelled && 'Samples labelled',
                      signOut.follow_up_appt_made && 'Follow-up appointment made'
                  ].filter(Boolean) as string[]
              });
          }

          return checklists;
      } catch (error) {
          console.log('error fetching checklist for procedure', error);
          return [];
      }
  }

  // fetch procedures for patient
  useEffect(() => {
    const fetchProcedures = async () => {
      if (!id) return;
      
      try {
        const patientProcsResponse = await procedureService.getAllPatientProceduresForPatient(id);
        
        const transformedProcedures = await Promise.all(
          patientProcsResponse.data.map(async (proc: any) => {
            console.log('Processing proc:', proc);
            console.log('proc.id:', proc.id);
            
            try {
              const procedureDetails = await procedureService.getProcedureByID(proc.procedure_id);
              console.log('proc.id before fetching checklist:', proc.id);
              const checklists = await fetchChecklistForProcedure(proc.id);
              
              return {
                id: proc.id,
                date: new Date(proc.scheduled_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }),
                name: procedureDetails.data.procedure_name,
                code: procedureDetails.data.procedure_code,
                physician: proc.physician,
                status: proc.status,
                checklists: checklists
              };
            } catch (error) {
              console.error(`Error fetching procedure details for ID ${proc.procedure_id}:`, error);
              return {
                id: proc.id,
                date: new Date(proc.scheduled_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                }),
                name: 'Unknown Procedure',
                code: 'N/A',
                physician: proc.physician,
                status: proc.status,
                checklists: []
              };
            }
          })
        );
        
        setProcedures(transformedProcedures);
        
        if (transformedProcedures.length > 0) {
          setExpandedProcedures([transformedProcedures[0].id]);
        }
      } catch (error) {
        console.error('Error fetching procedures:', error);
      }
    };

    fetchProcedures();
  }, [id]);

  // Handle successful procedure creation
  const handleProcedureCreated = async () => {
    setShowPrModal(false);
    
    try {
      const patientProcsResponse = await procedureService.getAllPatientProceduresForPatient(id);
      
      const transformedProcedures = await Promise.all(
        patientProcsResponse.data.map(async (proc: any) => {

          try {
            const procedureDetails = await procedureService.getProcedureByID(proc.procedure_id);
            const checklists = await fetchChecklistForProcedure(proc.id);
            
            return {
              id: proc.id,
              date: new Date(proc.scheduled_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              name: procedureDetails.data.procedure_name,
              code: procedureDetails.data.procedure_code,
              physician: proc.physician,
              status: proc.status,
              checklists: checklists
            };
          } catch (error) {
            console.error(`Error fetching procedure details for ID ${proc.procedure_id}:`, error);
            return {
              id: proc.id,
              date: new Date(proc.scheduled_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              name: 'Unknown Procedure',
              code: 'N/A',
              physician: proc.physician,
              status: proc.status,
              checklists: []
            };
          }
        })
      );
      
      setProcedures(transformedProcedures);
      
      if (transformedProcedures.length > 0) {
        setExpandedProcedures([transformedProcedures[0].id]);
      }
    } catch (error) {
      console.error('Error refreshing procedures:', error);
    }
  };
  
  if(loading){
    return <div>Loading...</div>
  }
  if (!patient) {
    return <div className="error-message">Patient not found</div>;
  }

  const handleSelectChecklistType = (procedureId: number, option: string) => { 
    setActiveProcedureId(procedureId); 
    setActiveChecklistModal(option);
  };

  const handleCloseChecklistModal = async () => {
    setActiveChecklistModal(null);
    setActiveProcedureId(null);
    if (!id) return;
    
    try {
      const patientProcsResponse = await procedureService.getAllPatientProceduresForPatient(id);
      
      const transformedProcedures = await Promise.all(
        patientProcsResponse.data.map(async (proc: any) => {
          try {
            const procedureDetails = await procedureService.getProcedureByID(proc.procedure_id);
            const checklists = await fetchChecklistForProcedure(proc.id);
            
            return {
              id: proc.id,
              date: new Date(proc.scheduled_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }),
              name: procedureDetails.data.procedure_name,
              code: procedureDetails.data.procedure_code,
              physician: proc.physician,
              status: proc.status,
              checklists: checklists
            };
          } catch (error) {
            return {
              id: proc.id,
              date: 'Unknown',
              name: 'Unknown Procedure',
              code: 'N/A',
              physician: proc.physician || 'Unknown',
              status: proc.status,
              checklists: []
            };
          }
        })
      );
      
      setProcedures(transformedProcedures);
    } catch (error) {
      console.error('Error refreshing procedures:', error);
    }
  };

  const toggleProcedure = (procedureId: number) => {
    setExpandedProcedures(prev => 
      prev.includes(procedureId)
        ? prev.filter(id => id !== procedureId)
        : [...prev, procedureId]
    );
  };

  const isProcedureExpanded = (procedureId: number) => {
    return expandedProcedures.includes(procedureId);
  };

  return (
    <div className="patient-detail-page">
      <div className="content-wrapper">
        <div className="patient-info-section">
          <h2 className="patient-name">{patient.first_name} {patient.last_name}</h2>

          <div className="info-columns">
            <div className="info-column">
              <div className="card">
                <h3 className="card-title">Contact Information</h3>
                <p className="contact-item">{patient.phone}</p>
              </div>

              <div className="card card-medical">
                <h3 className="card-title">Medical Information</h3>

                <div className="medical-section">
                  <p className="medical-label">Allergies</p>
                  <div className="medical-content">
                    {patient.allergies?.split(',').map((allergy, idx) => (
                      <span key={idx} className="allergy-tag">{allergy.trim()}</span>
                    ))}
                    <button className="arrow-button">→</button>
                  </div>
                </div>

                <div className="medical-section">
                  <p className="medical-label">Medications</p>
                  <div className="medical-content">
                    <span className="medical-text">{patient.medications || 'None'}</span>
                    <button className="arrow-button">→</button>
                  </div>
                </div>

                <div className="medical-section">
                  <p className="medical-label">Family History</p>
                  <div className="medical-content">
                    <span className="medical-text">{patient.medical_history || 'None'}</span>
                    <button className="arrow-button">→</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-column">
              <div className="card">
                <h3 className="card-title">Vitals</h3>
                <div className="vitals-list">
                  <div className="vital-item">
                    <strong>systolic blood pressure:</strong> {patient.blood_pressure_systolic}
                  </div>
                  <div className="vital-item">
                    <strong>diastolic blood pressure:</strong> {patient.blood_pressure_diastolic}
                  </div>
                  <div className="vital-item">
                    <strong>heart rate:</strong> {patient.heart_rate_bpm}
                  </div>
                  <div className="vital-item">
                    <strong>temperature:</strong> {patient.temperature_celsius}
                  </div>
                  <div className="vital-item">
                    <strong>respiratory rate:</strong> {patient.respiratory_rate_breaths_per_min}
                  </div>
                  <div className="vital-item">
                    <strong>oxygen saturation:</strong> {patient.oxygen_saturation_percent}
                  </div>
                  <div className="vital-item">
                    <strong>height (cm):</strong> {patient.height_cm}
                    <strong> weight (kg):</strong> {patient.weight_kg}
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">Lab Values</h3>
                <div className="lab-list">
                  <div className="lab-item">
                    <strong>hemoglobin:</strong> {patient.hemoglobin_gL}
                  </div>
                  <div className="lab-item">
                    <strong>hematocrit:</strong> {patient.hematocrit_LL}
                  </div>
                  <div className="lab-item">
                    <strong>platelet count:</strong> {patient.platelet_count}
                  </div>
                  <div className="lab-item">
                    <strong>white blood cell count:</strong> {patient.white_blood_cell_count}
                  </div>
                  <div className="lab-item">
                    <strong>creatinine:</strong> {patient.creatinine}
                  </div>
                  <div className="lab-item">
                    <strong>blood urea nitrogen (bun):</strong> {patient.bun_mmolL}
                  </div>
                  <div className="lab-item">
                    <strong>glucose:</strong> {patient.glucose_mmolL}
                  </div>
                  <div className="lab-item">
                    <strong>inr:</strong> {patient.inr}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="procedures-section">
          <div className="procedures-card">
            <div className="procedures-header">
              <h3 className="card-title">Procedures & Checklists</h3>
              <span className="add-procedure-btn" onClick={() => setShowPrModal(true)}>
                Add Procedure
              </span>
            </div>

            <div className="timeline">
              {procedures.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No procedures scheduled yet
                </div>
              ) : (
                procedures.map((procedure, idx) => (
                  <div key={procedure.id} className={`timeline-item ${idx === procedures.length - 1 ? 'last' : ''}`}>
                    <div className={`timeline-dot ${idx === 0 ? 'active' : ''}`} />
                    
                    {idx !== procedures.length - 1 && (
                      <div className="timeline-line" />
                    )}

                    <div className="timeline-content">
                      <div 
                        className="procedure-header"
                        onClick={() => toggleProcedure(procedure.id)}
                      >
                        <div className="procedure-header-left">
                          <span className={`collapse-arrow ${isProcedureExpanded(procedure.id) ? 'expanded' : ''}`}>
                            
                          </span>
                          <div>
                            <div className="procedure-date">{procedure.date}</div>
                            <div className="procedure-name">
                              {procedure.name} ({procedure.code})
                              {idx === 0 && <span className="status-indicator" />}
                            </div>
                            <div className="procedure-physician">{procedure.physician}</div>
                          </div>
                        </div>
                        
                        <div onClick={(e) => e.stopPropagation()}>
                          <AddChecklistDropdown
                            procedureId={procedure.id}
                            onSelectOption={(option) => handleSelectChecklistType(procedure.id, option)} // ← Pass procedure.id
                            onClose={handleCloseChecklistModal}
                          />
                        </div>
                      </div>

                      {isProcedureExpanded(procedure.id) && (
                        <div className="checklists-container">
                          {procedure.checklists.length === 0 ? (
                            <div style={{ fontSize: '13px', color: '#888', fontStyle: 'italic', padding: '10px 0' }}>
                              No checklists added yet
                            </div>
                          ) : (
                            procedure.checklists.map((checklist) => (
                              <div key={checklist.id} className="checklist-entry">
                                <div className="checklist-entry-header">
                                  <span className={`checklist-type-dot ${checklist.type}`} />
                                  <div className="checklist-entry-info">
                                    <span className="checklist-entry-date">{checklist.date}</span>
                                    <span className="checklist-entry-name">{checklist.name}</span>
                                  </div>
                                </div>
                                <ul className="checklist-entry-items">
                                  {checklist.items.map((item, itemIdx) => (
                                    <li key={itemIdx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            ))
                          )}
                          
                          <Link to={`/patients/${id}/view-procedure`}>
                            <div className="view-checklist-btn">
                              View Checklist
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <Link to={`/patients/${id}/view-all-procedures`}>
              <div className="view-all-btn">
                View All Procedures & Checklists
              </div>
            </Link>
          </div>
        </div>
        
      </div>
      
      {showPrModal && (
        <AddProcedureModal 
          patientId={id!} 
          onClose={() => setShowPrModal(false)} 
          onSuccess={handleProcedureCreated}
        />
      )}

      {activeChecklistModal === 'planning' && procedures.length > 0 && (
        <PreProceduralPlanningModal
          procedureId={activeProcedureId} 
          onClose={handleCloseChecklistModal}
          onSuccess={handleCloseChecklistModal}
        />
      )}

      {activeChecklistModal === 'signin' && procedures.length > 0 && (
        <SignInModal
          procedureId={activeProcedureId} 
          onClose={handleCloseChecklistModal}
          onSuccess={handleCloseChecklistModal}
        />
      )}

      {activeChecklistModal === 'signout' && procedures.length > 0 && (
        <SignOutModal
          procedureId={activeProcedureId} 
          onClose={handleCloseChecklistModal}
          onSuccess={handleCloseChecklistModal}
        />
      )}
    </div>
  );
};

export default PatientDetail;