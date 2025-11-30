import React, { useState, type ChangeEvent, type FormEvent } from 'react';
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

interface SignOutModalProps {
  procedureId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ChecklistItem {
  key: string;
  label: string;
  checked: boolean;
}

export const SignOutModal: React.FC<SignOutModalProps> = ({
  procedureId,
  onClose,
  onSuccess
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { key: 'vital_signs_normal', label: 'Vital signs normal during procedure', checked: false },
    { key: 'lab_tests_requested', label: 'Lab tests requested', checked: false },
    { key: 'samples_labelled', label: 'Samples properly labelled', checked: false },
    { key: 'samples_sent_to_lab', label: 'Samples sent to lab', checked: false },
    { key: 'follow_up_appt_made', label: 'Follow-up appointment scheduled', checked: false },
    { key: 'procedure_results_communicated_to_referring_physician', label: 'Results communicated to referring physician', checked: false }, // Changed from results_communicated
  ]);

  const [textFields, setTextFields] = useState({
    post_op_note: '',
    medications_recorded: '',
    contrast_media_recorded: '',
    procedure_results_discussed_with_patients: '', 
    post_discharge_instructions_given_to_patient: '' 
  });

  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');

  const toggleChecklistItem = (key: string) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.key === key ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setTextFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // prepare checklist data arr-> obj
    const checklistData = checklistItems.reduce((acc, item) => ({
      ...acc,
      [item.key]: item.checked
    }), {});

    let followUpDateTime = null;
    if (followUpDate && followUpTime) {
      followUpDateTime = `${followUpDate}T${followUpTime}:00`;
    }

    // combine form data
    const formData = {
      patient_procedure_id: procedureId,
      ...checklistData,
      ...textFields,
      follow_up_appt_date: followUpDateTime // Add this field
    };
    console.log('sending to backend', formData)

    try {
      // send to backend
      const response = await checklistService.createSignOut(formData)
      console.log('saved successfully', response)
      // on success close modal
      onSuccess()
      
    } catch (error) {
      console.log('error saving sign out data', error)
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

  const showFollowUpFields = checklistItems.find(item => item.key === 'follow_up_appt_made')?.checked;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container modal-large">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon signout">
              <LogOutIcon />
            </div>
            <div className="modal-header-text">
              <h2 className="modal-title">Sign Out</h2>
              <p className="modal-subtitle">Complete post-procedure documentation</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="modal-progress">
          <div className="progress-info">
            <span className="progress-label">Post-Procedure Checks</span>
            <span className="progress-count">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="progress-bar-large">
            <div
              className="progress-fill-large signout"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Checklist Section */}
          <div className="form-section">
            <h3 className="section-title">Post-Procedure Checklist</h3>
            <div className="checklist-grid">
              {checklistItems.map(item => (
                <label
                  key={item.key}
                  className={`checklist-checkbox-item ${item.checked ? 'checked' : ''}`}
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
                  <span className="checkbox-label">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Follow-up Appointment Details */}
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

          {/* Documentation Section */}
          <div className="form-section">
            <h3 className="section-title">Documentation</h3>

            <div className="form-field">
              <label htmlFor="post_op_note">
                <span className="label-text">Post-Op Note</span>
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
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit signout">
              Complete Sign Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignOutModal;