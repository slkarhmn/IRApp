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

const ClipboardListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface PreProceduralPlanningModalProps {
  procedureId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ChecklistItem {
  key: string;
  label: string;
  checked: boolean;
}

export const PreProceduralPlanningModal: React.FC<PreProceduralPlanningModalProps> = ({
  procedureId,
  onClose,
  onSuccess
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { key: 'discussed_with_referring_physician', label: 'Discussed with referring physician', checked: false },
    { key: 'imaging_studies_reviewed', label: 'Imaging studies reviewed', checked: false },
    { key: 'informed_consent', label: 'Informed consent obtained', checked: false },
    { key: 'prophylaxis', label: 'Prophylaxis administered', checked: false },
    { key: 'fasting_order', label: 'Fasting order confirmed', checked: false },
    { key: 'anaesthetist_necessary', label: 'Anaesthetist notified (if necessary)', checked: false },
    { key: 'anticoagulant_stopped', label: 'Anticoagulant stopped', checked: false },
    { key: 'post_precedural_bed_required', label: 'Post-procedural bed arranged', checked: false }, // Changed!
    { key: 'contrast_allergy_prophylaxis_necessary', label: 'Contrast allergy prophylaxis (if necessary)', checked: false }, 
  ]);

  const [textFields, setTextFields] = useState({
    relevant_medical_history: '',
    tools_requested_and_present: '',
    relevant_lab_tests: '',
  });

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

  const handleSubmit =async (e: FormEvent) => {
    e.preventDefault();

    // prepare checklist data arr-> obj
    const checklistData = checklistItems.reduce((acc, item) => ({
        ...acc,
        [item.key]: item.checked
    }), {});

    // combine form data
    const formData = {
      procedure_id: procedureId,
      ...checklistData,
      ...textFields
    };
    console.log('sending to backend', formData)
    
    try {
      // send to backend
      const response = await checklistService.createProcedurePlanning(formData)
      console.log('saved successfully', response)
      // on usccess close modal
      onSuccess()
      
    } catch (error) {
      console.log('error saving planning data', error)
    }

    console.log('Pre-Procedural Planning data:', formData);
    onSuccess();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const completedCount = checklistItems.filter(item => item.checked).length;
  const totalCount = checklistItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container modal-large">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon planning">
              <ClipboardListIcon />
            </div>
            <div className="modal-header-text">
              <h2 className="modal-title">Pre-Procedural Planning</h2>
              <p className="modal-subtitle">Complete the planning checklist before the procedure</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="modal-progress">
          <div className="progress-info">
            <span className="progress-label">Checklist Progress</span>
            <span className="progress-count">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="progress-bar-large">
            <div
              className="progress-fill-large"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Checklist Section */}
          <div className="form-section">
            <h3 className="section-title">Checklist Items</h3>
            <div className="checklist-grid">
              {checklistItems.map(item => (
                <label
                  key={item.key}
                  className={`checklist-checkbox-item ${item.checked ? 'checked' : ''}`}
                >
                  <div className="checkbox-custom">
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

          {/* Text Fields Section */}
          <div className="form-section">
            <h3 className="section-title">Additional Information</h3>

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

            ``
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Save Planning
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreProceduralPlanningModal;