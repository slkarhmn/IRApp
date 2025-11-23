/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Viewprocedurechecklist.css';

// Icon Components
const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const UserCheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

type ChecklistItemProps = {
  label: string;
  value?: boolean;
};

type TextFieldProps = {
  label: string;
  value?: string | null;
  fullWidth?: boolean;
};

type TabType = 'planning' | 'signin' | 'signout';

interface TabInfo {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export const ViewProcedureChecklist = () => {
  const { id } = useParams<{ id: string }>();
  const patientId = id || '1';
  
  const [activeTab, setActiveTab] = useState<TabType>('planning');

  // Mock data - you'll fetch this from your API
  const procedureData = {
    patient_name: "John Doe",
    procedure_name: "Appendectomy",
    procedure_code: "APX-001",
    scheduled_date: "Jan 15, 2025",
    scheduled_time: "2:30 PM",
    physician: "Dr. Smith",
    status: "Completed" as const
  };

  const tabs: TabInfo[] = [
    {
      id: 'planning',
      label: 'Pre-Procedural Planning',
      icon: <ClipboardIcon />,
      color: 'planning'
    },
    {
      id: 'signin',
      label: 'Sign In',
      icon: <UserCheckIcon />,
      color: 'signin'
    },
    {
      id: 'signout',
      label: 'Sign Out',
      icon: <FileTextIcon />,
      color: 'signout'
    }
  ];

  const planningData = {
    discussed_with_referring_physician: true,
    imaging_studies_reviewed: true,
    relevant_medical_history: "Patient has history of hypertension",
    informed_consent: true,
    prophylaxis: true,
    tools_requested_and_present: "Surgical instruments, anesthesia equipment",
    fasting_order: true,
    relevant_lab_tests: "CBC, Blood Type, Coagulation Panel",
    anaesthetist_necessary: true,
    anticoagulant_stopped: true,
    post_precedural_bed_required: true,
    contrast_allergy_prophylaxis_necessary: false
  };

  const signInData = {
    team_members_introduced: "Dr. Smith, Nurse Johnson, Anesthesiologist Dr. Lee",
    records_given_to_patient: "Consent forms, procedure information",
    correct_patient: true,
    correct_side: true,
    correct_site: true,
    patient_fasting_order_followed: true,
    iv_access_necessary: true,
    monitoring_equipment_attached: true,
    checked_lab_tests: "CBC results reviewed",
    allergies_checked: true,
    prophylaxis_checked: true,
    drugs_administered: "Midazolam 2mg IV, Fentanyl 50mcg IV",
    complications_discussed: "Bleeding, infection, anesthesia risks",
    consent_obtained: true
  };

  const signOutData = {
    post_op_note: "Procedure completed without complications. Patient stable.",
    vital_signs_normal: true,
    medications_recorded: "Morphine 5mg IV, Ondansetron 4mg IV",
    contrast_media_recorded: "None used",
    lab_tests_requested: true,
    samples_labelled: true,
    samples_sent_to_lab: true,
    procedure_results_discussed_with_patients: "Successful appendectomy, no complications",
    post_discharge_instructions_given_to_patient: "Rest for 2 weeks, no heavy lifting, wound care instructions",
    follow_up_appt_made: true,
    follow_up_appt_date: "Jan 29, 2025 at 10:00 AM",
    procedure_results_communicated_to_referring_physician: true
  };

  // Calculate completion stats for each tab
  const getCompletionStats = (tab: TabType) => {
    let completed = 0;
    let total = 0;

    if (tab === 'planning') {
      const booleanFields = Object.entries(planningData).filter(([_, value]) => typeof value === 'boolean');
      total = booleanFields.length;
      completed = booleanFields.filter(([_, value]) => value === true).length;
    } else if (tab === 'signin') {
      const booleanFields = Object.entries(signInData).filter(([_, value]) => typeof value === 'boolean');
      total = booleanFields.length;
      completed = booleanFields.filter(([_, value]) => value === true).length;
    } else if (tab === 'signout') {
      const booleanFields = Object.entries(signOutData).filter(([_, value]) => typeof value === 'boolean');
      total = booleanFields.length;
      completed = booleanFields.filter(([_, value]) => value === true).length;
    }

    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  return (
    <div className="checklist-page">
      {/* Header */}
      <div className="checklist-header">
        <div className="header-top">
          <Link to={`/patients/${patientId}`} className="back-link">
            <BackArrowIcon />
            <span>Back to Patient</span>
          </Link>
        </div>
        
        <div className="header-main">
          <div className="header-info">
            <h1 className="page-title">Procedure Checklist</h1>
            <div className="procedure-meta">
              <div className="meta-item">
                <span className="meta-label">Patient</span>
                <span className="meta-value">{procedureData.patient_name}</span>
              </div>
              <div className="meta-divider" />
              <div className="meta-item">
                <span className="meta-label">Procedure</span>
                <span className="meta-value">{procedureData.procedure_name} ({procedureData.procedure_code})</span>
              </div>
              <div className="meta-divider" />
              <div className="meta-item">
                <span className="meta-label">Physician</span>
                <span className="meta-value">{procedureData.physician}</span>
              </div>
              <div className="meta-divider" />
              <div className="meta-item">
                <span className="meta-label">Date & Time</span>
                <span className="meta-value">{procedureData.scheduled_date} at {procedureData.scheduled_time}</span>
              </div>
            </div>
          </div>
          <span className={`status-badge status-${procedureData.status.toLowerCase()}`}>
            {procedureData.status}
          </span>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="tabs-container">
        {tabs.map((tab) => {
          const stats = getCompletionStats(tab.id);
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              className={`tab tab-${tab.color} ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-icon">{tab.icon}</div>
              <div className="tab-content">
                <span className="tab-label">{tab.label}</span>
                <div className="tab-progress">
                  <div className="tab-progress-bar">
                    <div 
                      className="tab-progress-fill"
                      style={{ width: `${stats.percentage}%` }}
                    />
                  </div>
                  <span className="tab-progress-text">{stats.completed}/{stats.total}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="tab-content-wrapper">
        {/* Pre-Procedural Planning Tab */}
        {activeTab === 'planning' && (
          <div className="checklist-section">
            <div className="section-header">
              <h2 className="section-title">Checklist Items</h2>
              <span className="completion-badge">
                {getCompletionStats('planning').completed} of {getCompletionStats('planning').total} completed
              </span>
            </div>
            
            <div className="checklist-grid">
              <ChecklistItem
                label="Discussed with referring physician"
                value={planningData.discussed_with_referring_physician}
              />
              <ChecklistItem
                label="Imaging studies reviewed"
                value={planningData.imaging_studies_reviewed}
              />
              <ChecklistItem
                label="Informed consent obtained"
                value={planningData.informed_consent}
              />
              <ChecklistItem
                label="Prophylaxis administered"
                value={planningData.prophylaxis}
              />
              <ChecklistItem
                label="Fasting order confirmed"
                value={planningData.fasting_order}
              />
              <ChecklistItem
                label="Anaesthetist notified (if necessary)"
                value={planningData.anaesthetist_necessary}
              />
              <ChecklistItem
                label="Anticoagulant stopped"
                value={planningData.anticoagulant_stopped}
              />
              <ChecklistItem
                label="Post-procedural bed arranged"
                value={planningData.post_precedural_bed_required}
              />
              <ChecklistItem
                label="Contrast allergy prophylaxis (if necessary)"
                value={planningData.contrast_allergy_prophylaxis_necessary}
              />
            </div>

            <div className="section-divider" />

            <div className="section-header">
              <h2 className="section-title">Additional Information</h2>
            </div>

            <div className="text-fields">
              <TextField
                label="Relevant Medical History"
                value={planningData.relevant_medical_history}
                fullWidth
              />
              <TextField
                label="Tools Requested and Present"
                value={planningData.tools_requested_and_present}
              />
              <TextField
                label="Relevant Lab Tests"
                value={planningData.relevant_lab_tests}
              />
            </div>
          </div>
        )}

        {/* Sign In Tab */}
        {activeTab === 'signin' && (
          <div className="checklist-section">
            <div className="section-header">
              <h2 className="section-title">Safety Verification</h2>
              <span className="completion-badge">
                {getCompletionStats('signin').completed} of {getCompletionStats('signin').total} completed
              </span>
            </div>
            
            <div className="checklist-grid">
              <ChecklistItem
                label="Correct patient verified"
                value={signInData.correct_patient}
              />
              <ChecklistItem
                label="Correct side confirmed"
                value={signInData.correct_side}
              />
              <ChecklistItem
                label="Correct site confirmed"
                value={signInData.correct_site}
              />
              <ChecklistItem
                label="Patient fasting order followed"
                value={signInData.patient_fasting_order_followed}
              />
              <ChecklistItem
                label="IV access established (if necessary)"
                value={signInData.iv_access_necessary}
              />
              <ChecklistItem
                label="Monitoring equipment attached"
                value={signInData.monitoring_equipment_attached}
              />
              <ChecklistItem
                label="Allergies verified"
                value={signInData.allergies_checked}
              />
              <ChecklistItem
                label="Prophylaxis administered"
                value={signInData.prophylaxis_checked}
              />
              <ChecklistItem
                label="Consent obtained and verified"
                value={signInData.consent_obtained}
              />
            </div>

            <div className="section-divider" />

            <div className="section-header">
              <h2 className="section-title">Documentation</h2>
            </div>

            <div className="text-fields">
              <TextField
                label="Team Members Introduced"
                value={signInData.team_members_introduced}
              />
              <TextField
                label="Records Given to Patient"
                value={signInData.records_given_to_patient}
              />
              <TextField
                label="Lab Tests Reviewed"
                value={signInData.checked_lab_tests}
              />
              <TextField
                label="Medications Administered"
                value={signInData.drugs_administered}
              />
              <TextField
                label="Complications Discussed"
                value={signInData.complications_discussed}
                fullWidth
              />
            </div>
          </div>
        )}

        {/* Sign Out Tab */}
        {activeTab === 'signout' && (
          <div className="checklist-section">
            <div className="section-header">
              <h2 className="section-title">Post-Procedure Verification</h2>
              <span className="completion-badge">
                {getCompletionStats('signout').completed} of {getCompletionStats('signout').total} completed
              </span>
            </div>
            
            <div className="checklist-grid">
              <ChecklistItem
                label="Vital signs within normal range"
                value={signOutData.vital_signs_normal}
              />
              <ChecklistItem
                label="Lab tests requested (if needed)"
                value={signOutData.lab_tests_requested}
              />
              <ChecklistItem
                label="Samples properly labelled"
                value={signOutData.samples_labelled}
              />
              <ChecklistItem
                label="Samples sent to laboratory"
                value={signOutData.samples_sent_to_lab}
              />
              <ChecklistItem
                label="Follow-up appointment scheduled"
                value={signOutData.follow_up_appt_made}
              />
              <ChecklistItem
                label="Results communicated to referring physician"
                value={signOutData.procedure_results_communicated_to_referring_physician}
              />
            </div>

            <div className="section-divider" />

            <div className="section-header">
              <h2 className="section-title">Clinical Notes</h2>
            </div>

            <div className="text-fields">
              <TextField
                label="Post-Operative Note"
                value={signOutData.post_op_note}
                fullWidth
              />
              <TextField
                label="Medications Recorded"
                value={signOutData.medications_recorded}
              />
              <TextField
                label="Contrast Media Recorded"
                value={signOutData.contrast_media_recorded}
              />
              <TextField
                label="Results Discussed with Patient"
                value={signOutData.procedure_results_discussed_with_patients}
                fullWidth
              />
              <TextField
                label="Post-Discharge Instructions"
                value={signOutData.post_discharge_instructions_given_to_patient}
                fullWidth
              />
              {signOutData.follow_up_appt_date && (
                <TextField
                  label="Follow-Up Appointment"
                  value={signOutData.follow_up_appt_date}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced ChecklistItem Component
const ChecklistItem: React.FC<ChecklistItemProps> = ({ label, value }) => (
  <div className={`checklist-item ${value ? 'checked' : 'unchecked'}`}>
    <div className="checkbox-wrapper">
      {value ? <CheckCircleIcon /> : <CircleIcon />}
    </div>
    <span className="checklist-label">{label}</span>
  </div>
);

// Enhanced TextField Component
const TextField: React.FC<TextFieldProps> = ({ label, value, fullWidth = false }) => (
  <div className={`text-field ${fullWidth ? 'full-width' : ''}`}>
    <label className="field-label">{label}</label>
    <div className="field-value">{value || <span className="empty-value">Not provided</span>}</div>
  </div>
);

export default ViewProcedureChecklist;