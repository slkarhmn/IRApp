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

  // Fetch patient data
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

  // Fetch procedures for this patient
  useEffect(() => {
    const fetchProcedures = async () => {
      if (!id) return;
      
      try {
        // First, get all patient procedures
        const patientProcsResponse = await procedureService.getAllPatientProceduresForPatient(id);
        
        // Then, for each patient procedure, fetch the full procedure details
        const transformedProcedures = await Promise.all(
          patientProcsResponse.data.map(async (proc: any) => {
            try {
              // Fetch the procedure details using the procedure_id
              const procedureDetails = await procedureService.getProcedureByID(proc.procedure_id);
              
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
                checklists: []
              };
            } catch (error) {
              console.error(`Error fetching procedure details for ID ${proc.procedure_id}:`, error);
              // Return with fallback values if procedure fetch fails
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
        
        // Auto-expand the first procedure
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
    
    // Refresh procedures list
    try {
      const patientProcsResponse = await procedureService.getAllPatientProceduresForPatient(id);
      
      const transformedProcedures = await Promise.all(
        patientProcsResponse.data.map(async (proc: any) => {
          try {
            const procedureDetails = await procedureService.getProcedureByID(proc.procedure_id);
            
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
              checklists: []
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
      
      // Expand the newly created procedure
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

  const handleSelectChecklistType = (option: string) => {
    setActiveChecklistModal(option);
  };

  const handleCloseChecklistModal = () => {
    setActiveChecklistModal(null);
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
          {/* Patient Name */}
          <h2 className="patient-name">{patient.first_name} {patient.last_name}</h2>

          <div className="info-columns">
            {/* Contact Information & Medical Information */}
            <div className="info-column">
              {/* Contact Information */}
              <div className="card">
                <h3 className="card-title">Contact Information</h3>
                <p className="contact-item">{patient.phone}</p>
              </div>

              {/* Medical Information */}
              <div className="card card-medical">
                <h3 className="card-title">Medical Information</h3>

                {/* Allergies */}
                <div className="medical-section">
                  <p className="medical-label">Allergies</p>
                  <div className="medical-content">
                    {patient.allergies?.split(',').map((allergy, idx) => (
                      <span key={idx} className="allergy-tag">{allergy.trim()}</span>
                    ))}
                    <button className="arrow-button">→</button>
                  </div>
                </div>

                {/* Medications */}
                <div className="medical-section">
                  <p className="medical-label">Medications</p>
                  <div className="medical-content">
                    <span className="medical-text">{patient.medications || 'None'}</span>
                    <button className="arrow-button">→</button>
                  </div>
                </div>

                {/* Family History */}
                <div className="medical-section">
                  <p className="medical-label">Family History</p>
                  <div className="medical-content">
                    <span className="medical-text">{patient.medical_history || 'None'}</span>
                    <button className="arrow-button">→</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Vitals and Lab Values */}
            <div className="info-column">
              {/* Vitals */}
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

              {/* Lab Values */}
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

        {/* Procedures & Checklists */}
        <div className="procedures-section">
          <div className="procedures-card">
            <div className="procedures-header">
              <h3 className="card-title">Procedures & Checklists</h3>
              <span className="add-procedure-btn" onClick={() => setShowPrModal(true)}>
                Add Procedure
              </span>
            </div>

            {/* Timeline */}
            <div className="timeline">
              {procedures.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                  No procedures scheduled yet
                </div>
              ) : (
                procedures.map((procedure, idx) => (
                  <div key={procedure.id} className={`timeline-item ${idx === procedures.length - 1 ? 'last' : ''}`}>
                    {/* Timeline dot */}
                    <div className={`timeline-dot ${idx === 0 ? 'active' : ''}`} />
                    
                    {/* Timeline line */}
                    {idx !== procedures.length - 1 && (
                      <div className="timeline-line" />
                    )}

                    {/* Content */}
                    <div className="timeline-content">
                      {/* Procedure Header - Clickable */}
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
                        
                        {/* Add Checklist Dropdown */}
                        <div onClick={(e) => e.stopPropagation()}>
                          <AddChecklistDropdown
                            procedureId={procedure.id}
                            onSelectOption={handleSelectChecklistType}
                            onClose={handleCloseChecklistModal}
                          />
                        </div>
                      </div>

                      {/* Collapsible Checklists */}
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
      
      {/* Add Procedure Modal */}
      {showPrModal && (
        <AddProcedureModal 
          patientId={id!} 
          onClose={() => setShowPrModal(false)} 
          onSuccess={handleProcedureCreated}
        />
      )}

      {/* Checklist Modals */}
      {activeChecklistModal === 'planning' && procedures.length > 0 && (
        <PreProceduralPlanningModal
          procedureId={procedures[0].id}
          onClose={handleCloseChecklistModal}
          onSuccess={handleCloseChecklistModal}
        />
      )}

      {activeChecklistModal === 'signin' && procedures.length > 0 && (
        <SignInModal
          procedureId={procedures[0].id}
          onClose={handleCloseChecklistModal}
          onSuccess={handleCloseChecklistModal}
        />
      )}

      {activeChecklistModal === 'signout' && procedures.length > 0 && (
        <SignOutModal
          procedureId={procedures[0].id}
          onClose={handleCloseChecklistModal}
          onSuccess={handleCloseChecklistModal}
        />
      )}
    </div>
  );
};

export default PatientDetail;