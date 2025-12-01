import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import './Modals.css';
// @ts-expect-error fuck ts
import { checklistService } from "../../services/checklists";

// Icon Components
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

type ChecklistType = 'planning' | 'signin' | 'signout';

interface EditChecklistModalProps {
  checklistId: number;
  checklistType: ChecklistType;
  procedureId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ChecklistItem {
  key: string;
  label: string;
  checked: boolean;
  critical?: boolean;
}

export const EditChecklistModal: React.FC<EditChecklistModalProps> = ({
  checklistId,
  checklistType,
  procedureId,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(true);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [textFields, setTextFields] = useState<Record<string, any>>({});
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');

  // Fetch existing checklist data
  useEffect(() => {
    const fetchChecklistData = async () => {
      try {
        let response;
        
        if (checklistType === 'planning') {
          response = await checklistService.getProcedurePlanning(checklistId);
          
          setChecklistItems([
            { key: 'discussed_with_referring_physician', label: 'Discussed with referring physician', checked: response.data.discussed_with_referring_physician || false },
            { key: 'imaging_studies_reviewed', label: 'Imaging studies reviewed', checked: response.data.imaging_studies_reviewed || false },
            { key: 'informed_consent', label: 'Informed consent obtained', checked: response.data.informed_consent || false },
            { key: 'prophylaxis', label: 'Prophylaxis administered', checked: response.data.prophylaxis || false },
            { key: 'fasting_order', label: 'Fasting order confirmed', checked: response.data.fasting_order || false },
            { key: 'anaesthetist_necessary', label: 'Anaesthetist notified (if necessary)', checked: response.data.anaesthetist_necessary || false },
            { key: 'anticoagulant_stopped', label: 'Anticoagulant stopped', checked: response.data.anticoagulant_stopped || false },
            { key: 'post_precedural_bed_required', label: 'Post-procedural bed arranged', checked: response.data.post_precedural_bed_required || false },
            { key: 'contrast_allergy_prophylaxis_necessary', label: 'Contrast allergy prophylaxis (if necessary)', checked: response.data.contrast_allergy_prophylaxis_necessary || false },
          ]);
          
          setTextFields({
            relevant_medical_history: response.data.relevant_medical_history || '',
            tools_requested_and_present: response.data.tools_requested_and_present || '',
            relevant_lab_tests: response.data.relevant_lab_tests || '',
          });
          
        } else if (checklistType === 'signin') {
          response = await checklistService.getSignIn(checklistId);
          
          setChecklistItems([
            { key: 'correct_patient', label: 'Correct patient confirmed', checked: response.data.correct_patient || false, critical: true },
            { key: 'correct_side', label: 'Correct side verified', checked: response.data.correct_side || false, critical: true },
            { key: 'correct_site', label: 'Correct site marked', checked: response.data.correct_site || false, critical: true },
            { key: 'patient_fasting_order_followed', label: 'Patient fasting order followed', checked: response.data.patient_fasting_order_followed || false },
            { key: 'iv_access_necessary', label: 'IV access established', checked: response.data.iv_access_necessary || false },
            { key: 'monitoring_equipment_attached', label: 'Monitoring equipment attached', checked: response.data.monitoring_equipment_attached || false },
            { key: 'allergies_checked', label: 'Allergies checked', checked: response.data.allergies_checked || false, critical: true },
            { key: 'prophylaxis_checked', label: 'Prophylaxis administered', checked: response.data.prophylaxis_checked || false },
            { key: 'consent_obtained', label: 'Consent obtained', checked: response.data.consent_obtained || false, critical: true },
          ]);
          
          setTextFields({
            team_members_introduced: response.data.team_members_introduced || '',
            records_given_to_patient: response.data.records_given_to_patient || '',
            checked_lab_tests: response.data.checked_lab_tests || '',
            drugs_administered: response.data.drugs_administered || '',
            complications_discussed: response.data.complications_discussed || ''
          });
          
        } else if (checklistType === 'signout') {
          response = await checklistService.getSignOut(checklistId);
          
          setChecklistItems([
            { key: 'vital_signs_normal', label: 'Vital signs normal during procedure', checked: response.data.vital_signs_normal || false },
            { key: 'lab_tests_requested', label: 'Lab tests requested', checked: response.data.lab_tests_requested || false },
            { key: 'samples_labelled', label: 'Samples properly labelled', checked: response.data.samples_labelled || false },
            { key: 'samples_sent_to_lab', label: 'Samples sent to lab', checked: response.data.samples_sent_to_lab || false },
            { key: 'follow_up_appt_made', label: 'Follow-up appointment scheduled', checked: response.data.follow_up_appt_made || false },
            { key: 'procedure_results_communicated_to_referring_physician', label: 'Results communicated to referring physician', checked: response.data.procedure_results_communicated_to_referring_physician || false },
          ]);
          
          setTextFields({
            post_op_note: response.data.post_op_note || '',
            medications_recorded: response.data.medications_recorded || '',
            contrast_media_recorded: response.data.contrast_media_recorded || '',
            procedure_results_discussed_with_patients: response.data.procedure_results_discussed_with_patients || '',
            post_discharge_instructions_given_to_patient: response.data.post_discharge_instructions_given_to_patient || ''
          });
          
          // Parse follow-up date and time
          if (response.data.follow_up_appt_date) {
            const dateObj = new Date(response.data.follow_up_appt_date);
            setFollowUpDate(dateObj.toISOString().split('T')[0]);
            setFollowUpTime(dateObj.toTimeString().slice(0, 5));
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching checklist data:', error);
        setLoading(false);
      }
    };

    fetchChecklistData();
  }, [checklistId, checklistType]);

  const toggleChecklistItem = (key: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.key === key ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTextFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const checklistData = checklistItems.reduce((acc, item) => ({
      ...acc,
      [item.key]: item.checked
    }), {});

    let formData: any = {
      patient_procedure_id: procedureId,
      ...checklistData,
      ...textFields
    };

    // Add follow-up date for signout
    if (checklistType === 'signout' && followUpDate && followUpTime) {
      formData.follow_up_appt_date = `${followUpDate}T${followUpTime}:00`;
    }

    console.log('Updating checklist:', formData);

    try {
      if (checklistType === 'planning') {
        await checklistService.updateProcedurePlanning(checklistId, formData);
      } else if (checklistType === 'signin') {
        await checklistService.updateSignIn(checklistId, formData);
      } else if (checklistType === 'signout') {
        await checklistService.updateSignOut(checklistId, formData);
      }
      
      console.log('Checklist updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Error updating checklist:', error);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const completedCount = checklistItems.filter(item => item.checked).length;
  const totalCount = checklistItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const criticalItems = checklistItems.filter(item => item.critical);
  const criticalComplete = criticalItems.filter(item => item.checked).length;

  const showFollowUpFields = checklistType === 'signout' && 
    checklistItems.find(item => item.key === 'follow_up_appt_made')?.checked;

  const getModalTitle = () => {
    switch (checklistType) {
      case 'planning': return 'Edit Pre-Procedural Planning';
      case 'signin': return 'Edit Sign In';
      case 'signout': return 'Edit Sign Out';
      default: return 'Edit Checklist';
    }
  };

  const getModalIcon = () => {
    switch (checklistType) {
      case 'planning': return <ClipboardListIcon />;
      case 'signin': return <CheckCircleIcon />;
      case 'signout': return <LogOutIcon />;
      default: return <ClipboardListIcon />;
    }
  };

  const getModalIconClass = () => {
    switch (checklistType) {
      case 'planning': return 'planning';
      case 'signin': return 'signin';
      case 'signout': return 'signout';
      default: return 'planning';
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-container modal-large">
          <div className="modal-loading">
            <div className="spinner" />
            <span className="modal-loading-text">Loading checklist data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container modal-large">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className={`modal-icon ${getModalIconClass()}`}>
              {getModalIcon()}
            </div>
            <div className="modal-header-text">
              <h2 className="modal-title">{getModalTitle()}</h2>
              <p className="modal-subtitle">Update checklist information</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="modal-progress">
          <div className="progress-info">
            <span className="progress-label">
              {checklistType === 'signin' ? 'Safety Checks' : 'Checklist Progress'}
            </span>
            <span className="progress-count">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="progress-bar-large">
            <div
              className={`progress-fill-large ${checklistType}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {checklistType === 'signin' && (
            <div className="critical-indicator">
              <span className={`critical-badge ${criticalComplete === criticalItems.length ? 'complete' : ''}`}>
                {criticalComplete}/{criticalItems.length} Critical Checks
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Checklist Section */}
          <div className="form-section">
            <h3 className="section-title">
              {checklistType === 'signin' ? 'Safety Checklist' : 'Checklist Items'}
            </h3>
            {checklistType === 'signin' && (
              <p className="section-description">
                Items marked with a red indicator are critical and must be completed.
              </p>
            )}
            <div className="checklist-grid">
              {checklistItems.map(item => (
                <label
                  key={item.key}
                  className={`checklist-checkbox-item ${item.checked ? 'checked' : ''} ${item.critical ? 'critical' : ''}`}
                >
                  <div className={`checkbox-custom ${item.checked ? 'checked' : ''}`}>
                    {item.checked && <CheckIcon />}
                  </div>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.key)}
                    className="checkbox-hidden"
                  />
                  <span className="checkbox-label">
                    {item.label}
                    {item.critical && <span className="critical-dot" />}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Text Fields Section */}
          <div className="form-section">
            <h3 className="section-title">
              {checklistType === 'signout' ? 'Clinical Notes' : 
               checklistType === 'signin' ? 'Documentation' : 
               'Additional Information'}
            </h3>

            {checklistType === 'planning' && (
              <>
                <div className="form-field">
                  <label htmlFor="relevant_medical_history">
                    <span className="label-text">Relevant Medical History</span>
                  </label>
                  <textarea
                    id="relevant_medical_history"
                    name="relevant_medical_history"
                    value={textFields.relevant_medical_history}
                    onChange={handleTextChange}
                    placeholder="Enter any relevant medical history..."
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="tools_requested_and_present">
                      <span className="label-text">Tools Requested & Present</span>
                    </label>
                    <textarea
                      id="tools_requested_and_present"
                      name="tools_requested_and_present"
                      value={textFields.tools_requested_and_present}
                      onChange={handleTextChange}
                      placeholder="List required tools and equipment..."
                      rows={3}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="relevant_lab_tests">
                      <span className="label-text">Relevant Lab Tests</span>
                    </label>
                    <textarea
                      id="relevant_lab_tests"
                      name="relevant_lab_tests"
                      value={textFields.relevant_lab_tests}
                      onChange={handleTextChange}
                      placeholder="List lab tests reviewed..."
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            {checklistType === 'signin' && (
              <>
                <div className="form-field">
                  <label htmlFor="team_members_introduced">
                    <span className="label-text">Team Members Introduced</span>
                  </label>
                  <textarea
                    id="team_members_introduced"
                    name="team_members_introduced"
                    value={textFields.team_members_introduced}
                    onChange={handleTextChange}
                    placeholder="List all team members present..."
                    rows={2}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="records_given_to_patient">
                      <span className="label-text">Records Given to Patient</span>
                    </label>
                    <textarea
                      id="records_given_to_patient"
                      name="records_given_to_patient"
                      value={textFields.records_given_to_patient}
                      onChange={handleTextChange}
                      placeholder="List records provided..."
                      rows={2}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="checked_lab_tests">
                      <span className="label-text">Lab Tests Reviewed</span>
                    </label>
                    <textarea
                      id="checked_lab_tests"
                      name="checked_lab_tests"
                      value={textFields.checked_lab_tests}
                      onChange={handleTextChange}
                      placeholder="Lab tests reviewed..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="drugs_administered">
                      <span className="label-text">Drugs Administered</span>
                    </label>
                    <textarea
                      id="drugs_administered"
                      name="drugs_administered"
                      value={textFields.drugs_administered}
                      onChange={handleTextChange}
                      placeholder="List medications given..."
                      rows={2}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="complications_discussed">
                      <span className="label-text">Complications Discussed</span>
                    </label>
                    <textarea
                      id="complications_discussed"
                      name="complications_discussed"
                      value={textFields.complications_discussed}
                      onChange={handleTextChange}
                      placeholder="Potential complications discussed..."
                      rows={2}
                    />
                  </div>
                </div>
              </>
            )}

            {checklistType === 'signout' && (
              <>
                <div className="form-field">
                  <label htmlFor="post_op_note">
                    <span className="label-text">Post-Operative Note</span>
                  </label>
                  <textarea
                    id="post_op_note"
                    name="post_op_note"
                    value={textFields.post_op_note}
                    onChange={handleTextChange}
                    placeholder="Enter post-operative notes..."
                    rows={3}
                  />
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="medications_recorded">
                      <span className="label-text">Medications Recorded</span>
                    </label>
                    <textarea
                      id="medications_recorded"
                      name="medications_recorded"
                      value={textFields.medications_recorded}
                      onChange={handleTextChange}
                      placeholder="List medications administered..."
                      rows={2}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contrast_media_recorded">
                      <span className="label-text">Contrast Media</span>
                    </label>
                    <textarea
                      id="contrast_media_recorded"
                      name="contrast_media_recorded"
                      value={textFields.contrast_media_recorded}
                      onChange={handleTextChange}
                      placeholder="Document contrast media used..."
                      rows={2}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="procedure_results_discussed_with_patients">
                    <span className="label-text">Results Discussed with Patient</span>
                  </label>
                  <textarea
                    id="procedure_results_discussed_with_patients"
                    name="procedure_results_discussed_with_patients"
                    value={textFields.procedure_results_discussed_with_patients}
                    onChange={handleTextChange}
                    placeholder="What was discussed with the patient..."
                    rows={2}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="post_discharge_instructions_given_to_patient">
                    <span className="label-text">Post-Discharge Instructions</span>
                  </label>
                  <textarea
                    id="post_discharge_instructions_given_to_patient"
                    name="post_discharge_instructions_given_to_patient"
                    value={textFields.post_discharge_instructions_given_to_patient}
                    onChange={handleTextChange}
                    placeholder="Instructions provided to the patient..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          {/* Follow-up Appointment Details (Sign Out only) */}
          {showFollowUpFields && (
            <div className="form-section highlight">
              <h3 className="section-title">Follow-up Appointment</h3>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="follow_up_date">
                    <span className="label-text">Date</span>
                    <span className="required">*</span>
                  </label>
                  <div className="input-wrapper icon-left">
                    <CalendarIcon />
                    <input
                      type="date"
                      id="follow_up_date"
                      name="follow_up_date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="follow_up_time">
                    <span className="label-text">Time</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="time"
                    id="follow_up_time"
                    name="follow_up_time"
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Update Checklist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditChecklistModal;