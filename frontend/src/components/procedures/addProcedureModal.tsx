import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import './Modals.css';
//@ts-expect-error fuck ts
import {procedureService} from "../../services/procedures"

// Icon Components
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
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


const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

interface AddProcedureModalProps {
  patientId: number | string;
  onClose: () => void;
  onSuccess: () => void;
}


export const AddProcedureModal: React.FC<AddProcedureModalProps> = ({
  patientId,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    patient_id: patientId,
    procedure_id: '',
    physician_id: '',
    scheduled_date: '',
    scheduled_time: '',
    status: 'scheduled',     
    urgency: 'routine',   
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.procedure_id) {
      newErrors.procedure_id = 'Please select a procedure';
    }
    if (!formData.physician_id) {
      newErrors.physician_id = 'Please select a physician';
    }
    if (!formData.scheduled_date) {
      newErrors.scheduled_date = 'Please select a date';
    }
    if (!formData.scheduled_time) {
      newErrors.scheduled_time = 'Please select a time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if(!validateForm() ){
      return ;
    }
    try {
      // prepare the data for the api
      const procedureData = {
        patient_id: parseInt(patientId as string),
        procedure_id: parseInt(formData.procedure_id),
        physician: formData.physician_id, // Note: sending physician name directly
        scheduled_date: `${formData.scheduled_date}T${formData.scheduled_time}:00`,
        status: formData.status,
        urgency: formData.urgency,
        prep_requirements: formData.notes ? { notes: formData.notes } : {}
      }
      console.log('Sending procedure data:', procedureData);

      // call the api to create the procedure
      await procedureService.createPatientProcedure(procedureData)
      console.log('Procedure created successfully!');
      onSuccess();
    } catch (error) {
      console.log('error creating procedure', error)
    }
  };

  type procedures= {
    id:number,
    procedure_name:string,
    procedure_code:string,
    specialised_checklist:JSON
  }
  const [procedures, setProcedures] = useState<procedures[]>([]);

  // fetch procedure from procedures model when modal opens
  useEffect(() => {
    const fetchProcedures = async()=>{
      try {
        const response = await procedureService.getAllProcedures()
        setProcedures(response.data)
        console.log('available procedures', response.data)
      } catch (error) {
        console.log('error fetching the procedures', error)
      }
    }
  
    fetchProcedures()
  }, [])
  

  return (
    <div className="modal-overlay" >
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon procedure">
              <ClipboardIcon />
            </div>
            <div className="modal-header-text">
              <h2 className="modal-title">Add Procedure</h2>
              <p className="modal-subtitle">Schedule a new procedure for this patient</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Procedure Selection */}
          <div className="form-section">
            <h3 className="section-title">Procedure Details</h3>

            <div className="form-field">
              <label htmlFor="procedure_id">
                <span className="label-text">Procedure</span>
                <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="procedure_id"
                  name="procedure_id"
                  value={formData.procedure_id}
                  onChange={handleChange}
                  className={errors.procedure_id ? 'error' : ''}
                >
                  <option value="">Select a procedure</option>
                  {procedures.map(proc => (
                    <option key={proc.id} value={proc.id}>
                      {proc.procedure_name} ({proc.procedure_code})
                    </option>
                  ))}
                </select>
              </div>
              {errors.procedure_id && (
                <span className="error-message">{errors.procedure_id}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="physician_id">
                <span className="label-text">Physician</span>
                <span className="required">*</span>
              </label>
              <div className="input-wrapper icon-left">
               
                <input
                  type="text"
                  id="physician_id"
                  name="physician_id"
                  value={formData.physician_id}
                  onChange={handleChange}
                  placeholder="Enter physician name (e.g., Dr. Smith)"
                  className={errors.physician_id ? 'error' : ''}
                />
              </div>
              {errors.physician_id && (
                <span className="error-message">{errors.physician_id}</span>
              )}
            </div>
          </div>

          {/* Scheduling */}
          <div className="form-section">
            <h3 className="section-title">Schedule</h3>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="scheduled_date">
                  <span className="label-text">Date</span>
                  <span className="required">*</span>
                </label>
                <div className="input-wrapper icon-left">
                  <CalendarIcon />
                  <input
                    type="date"
                    id="scheduled_date"
                    name="scheduled_date"
                    value={formData.scheduled_date}
                    onChange={handleChange}
                    className={errors.scheduled_date ? 'error' : ''}
                  />
                </div>
                {errors.scheduled_date && (
                  <span className="error-message">{errors.scheduled_date}</span>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="scheduled_time">
                  <span className="label-text">Time</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="time"
                  id="scheduled_time"
                  name="scheduled_time"
                  value={formData.scheduled_time}
                  onChange={handleChange}
                  className={errors.scheduled_time ? 'error' : ''}
                />
                {errors.scheduled_time && (
                  <span className="error-message">{errors.scheduled_time}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="status">
                  <span className="label-text">Status</span>
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="urgency">
                  <span className="label-text">Urgency</span>
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <option value="routine">Routine</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergent">Emergent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <h3 className="section-title">Additional Notes</h3>

            <div className="form-field">
              <label htmlFor="notes">
                <span className="label-text">Notes</span>
                <span className="optional">(optional)</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes or special instructions..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Procedure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProcedureModal;