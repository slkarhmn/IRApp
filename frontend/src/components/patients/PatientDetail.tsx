import React from 'react';
import { useParams } from 'react-router-dom';
import patientData from './patientDataList.json';
import "../../styles/patientDetail.css"

// hardcoded vitals/lab values/procedure and checklists, medical information
const VITALS = {
  systolicBP: '120 mmHg',
  diastolicBP: '80 mmHg',
  heartRate: '72 bpm',
  temperature: '98.6°F',
  respiratoryRate: '16 breaths/min',
  oxygenSaturation: '98%',
  height: '5\'8"',
  weight: '165 lbs'
};

const LAB_VALUES = {
  hemoglobin: '14.5 g/dL',
  hematocrit: '42%',
  plateletCount: '250,000/μL',
  wbc: '7,500/μL',
  bun: '18 mg/dL',
  glucose: '95 mg/dL',
  inr: '1.0',
  pt: '12 sec',
  ptt: '30 sec'
};

const PROCEDURES = [
  {
    id: 1,
    date: 'Feb 5 2025',
    name: 'xyz procedure',
    count: 23,
    items: [
      'post-op note was written',
      'vital signs normal during procedure',
      'medications and contrast media recorded...'
    ]
  },
  {
    id: 2,
    date: 'Jan 28 2025',
    name: 'Pre procedural Planning',
    items: [
      'reviewed imaging studies with physician',
      'multidisciplinary team (MDT)',
      'imaging studies reviewed',
      'consent obtained',
      'informed consent...'
    ]
  },
  {
    id: 3,
    date: 'Dec 15 2024',
    name: 'Sign In',
    items: [
      'all team members introduced',
      'all records with patient',
      'correct patient/site/side...'
    ]
  },
  {
    id: 4,
    date: 'Feb 2 2025',
    name: 'Sign Out',
    items: [
      'post-op note was written',
      'vital signs were stable',
      'medications and contrast media recorded',
      'lab tests requested'
    ]
  }
];

const ALLERGIES = ['Penicillin', 'Penicillin'];
const MEDICATIONS = ['Aspirin, Beta-Blockers'];
const FAMILY_HISTORY = ['Cardiovascular disease'];

const PatientDetail = () => {
  const { id } = useParams();
  const patient = patientData.find(p => p.id === Number(id));

  if (!patient) {
    return <div className="error-message">Patient not found</div>;
  }

  return (
    <div className="patient-detail-page">

      <div className="content-wrapper">
        <div className="patient-info-section">
          {/* Patient Name */}
          <h2 className="patient-name">{patient.fullName}</h2>

          <div className="info-columns">
            {/* Contact Information & Medical Information */}
            <div className="info-column">
              {/* Contact Information */}
              <div className="card">
                <h3 className="card-title">Contact Information</h3>
                <p className="contact-item">{patient.email}</p>
                <p className="contact-item">{patient.phoneNumber}</p>
              </div>

              {/* Medical Information */}
              <div className="card card-medical">
                <h3 className="card-title">Medical Information</h3>

                {/* Allergies */}
                <div className="medical-section">
                  <p className="medical-label">Allergies</p>
                  <div className="medical-content">
                    {ALLERGIES.map((allergy, idx) => (
                      <span key={idx} className="allergy-tag">
                        {allergy}
                      </span>
                    ))}
                    <button className="arrow-button">→</button>
                  </div>
                </div>

                {/* Medications */}
                <div className="medical-section">
                  <p className="medical-label">Medications</p>
                  <div className="medical-content">
                    <span className="medical-text">{MEDICATIONS[0]}</span>
                    <button className="arrow-button">→</button>
                  </div>
                </div>

                {/* Family History */}
                <div className="medical-section">
                  <p className="medical-label">Family History</p>
                  <div className="medical-content">
                    <span className="medical-text">{FAMILY_HISTORY[0]}</span>
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
                    <strong>systolic blood pressure:</strong> {VITALS.systolicBP}
                  </div>
                  <div className="vital-item">
                    <strong>diastolic blood pressure:</strong> {VITALS.diastolicBP}
                  </div>
                  <div className="vital-item">
                    <strong>heart rate:</strong> {VITALS.heartRate}
                  </div>
                  <div className="vital-item">
                    <strong>temperature:</strong> {VITALS.temperature}
                  </div>
                  <div className="vital-item">
                    <strong>respiratory rate:</strong> {VITALS.respiratoryRate}
                  </div>
                  <div className="vital-item">
                    <strong>oxygen saturation:</strong> {VITALS.oxygenSaturation}
                  </div>
                  <div className="vital-item">
                    <strong>height (cm):</strong> {VITALS.height}
                  </div>
                </div>
              </div>

              {/* Lab Values */}
              <div className="card">
                <h3 className="card-title">Lab Values</h3>
                <div className="lab-list">
                  <div className="lab-item">
                    <strong>hemoglobin:</strong> {LAB_VALUES.hemoglobin}
                  </div>
                  <div className="lab-item">
                    <strong>hematocrit:</strong> {LAB_VALUES.hematocrit}
                  </div>
                  <div className="lab-item">
                    <strong>platelet count:</strong> {LAB_VALUES.plateletCount}
                  </div>
                  <div className="lab-item">
                    <strong>white blood cell count:</strong> {LAB_VALUES.wbc}
                  </div>
                  <div className="lab-item">
                    <strong>blood urea nitrogen (bun):</strong> {LAB_VALUES.bun}
                  </div>
                  <div className="lab-item">
                    <strong>glucose, inr, pt, ptt</strong>
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
              <button className="add-procedure-btn">Add Procedure</button>
            </div>

            {/* Timeline */}
            <div className="timeline">
              {PROCEDURES.map((procedure, idx) => (
                <div key={procedure.id} className={`timeline-item ${idx === PROCEDURES.length - 1 ? 'last' : ''}`}>
                  {/* Timeline dot */}
                  <div className={`timeline-dot ${idx === 0 ? 'active' : ''}`} />
                  
                  {/* Timeline line */}
                  {idx !== PROCEDURES.length - 1 && (
                    <div className="timeline-line" />
                  )}

                  {/* Content */}
                  <div className="timeline-content">
                    <div className="procedure-date">{procedure.date}</div>
                    <div className="procedure-name">
                      {procedure.name} {procedure.count && `(${procedure.count})`}
                      {idx === 0 && <span className="status-indicator" />}
                    </div>
                    <ul className="procedure-items">
                      {procedure.items.map((item, itemIdx) => (
                        <li key={itemIdx}>{item}</li>
                      ))}
                    </ul>
                    {idx === 0 && (
                      <button className="view-checklist-btn">
                        View Checklist →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button className="view-all-btn">
              View All Procedures & Checklists
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;