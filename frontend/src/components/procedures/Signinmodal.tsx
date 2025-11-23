import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import './Modals.css';

// Icon Components
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface SignInModalProps {
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

export const SignInModal: React.FC<SignInModalProps> = ({
  procedureId,
  onClose,
  onSuccess
}) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { key: 'correct_patient', label: 'Correct patient confirmed', checked: false, critical: true },
    { key: 'correct_side', label: 'Correct side verified', checked: false, critical: true },
    { key: 'correct_site', label: 'Correct site marked', checked: false, critical: true },
    { key: 'patient_fasting_order_followed', label: 'Patient fasting order followed', checked: false },
    { key: 'iv_access_necessary', label: 'IV access established', checked: false },
    { key: 'monitoring_equipment_attached', label: 'Monitoring equipment attached', checked: false },
    { key: 'allergies_checked', label: 'Allergies checked', checked: false, critical: true },
    { key: 'prophylaxis_checked', label: 'Prophylaxis administered', checked: false },
    { key: 'consent_obtained', label: 'Consent obtained', checked: false, critical: true },
  ]);

  const [textFields, setTextFields] = useState({
    team_members_introduced: '',
    records_given_to_patient: '',
    checked_lab_tests: '',
    drugs_administered: '',
    complications_discussed: ''
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Check if all critical items are completed
    const criticalItems = checklistItems.filter(item => item.critical);
    const allCriticalComplete = criticalItems.every(item => item.checked);

    if (!allCriticalComplete) {
      alert('Please complete all critical safety checks before proceeding.');
      return;
    }

    const formData = {
      procedure_id: procedureId,
      checklist: checklistItems.reduce((acc, item) => ({
        ...acc,
        [item.key]: item.checked
      }), {}),
      ...textFields
    };

    console.log('Sign In data:', formData);
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

  const criticalItems = checklistItems.filter(item => item.critical);
  const criticalComplete = criticalItems.filter(item => item.checked).length;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container modal-large">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon signin">
              <CheckCircleIcon />
            </div>
            <div className="modal-header-text">
              <h2 className="modal-title">Sign In</h2>
              <p className="modal-subtitle">Complete patient verification and safety checks</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="modal-progress">
          <div className="progress-info">
            <span className="progress-label">Safety Checks</span>
            <span className="progress-count">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="progress-bar-large">
            <div
              className="progress-fill-large signin"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="critical-indicator">
            <span className={`critical-badge ${criticalComplete === criticalItems.length ? 'complete' : ''}`}>
              {criticalComplete}/{criticalItems.length} Critical Checks
            </span>
          </div>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Checklist Section */}
          <div className="form-section">
            <h3 className="section-title">Safety Checklist</h3>
            <p className="section-description">
              Items marked with a red indicator are critical and must be completed.
            </p>
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
            <h3 className="section-title">Documentation</h3>

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
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit signin">
              Complete Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInModal;