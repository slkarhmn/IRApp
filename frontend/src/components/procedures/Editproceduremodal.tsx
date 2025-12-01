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

const ClipboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

interface EditProcedureModalProps {
  procedureId: number;
  initialData: {
    procedure_id: number;
    patient_id: number; 
    physician: string;  
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const EditProcedureModal: React.FC<EditProcedureModalProps> = ({
  procedureId,
  initialData,
  onClose,
  onSuccess
}) => {
  const [selectedProcedureId, setSelectedProcedureId] = useState(initialData.procedure_id.toString());
  const [procedures, setProcedures] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProcedures = async()=>{
      try {
        const response = await procedureService.getAllProcedures()
        setProcedures(response.data)
      } catch (error) {
        console.log('error fetching the procedures', error)
      }
    }
    fetchProcedures()
  }, [])

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProcedureId(e.target.value);
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if(!selectedProcedureId) {
      setError('Please select a procedure');
      return;
    }

    try {
      const updateData = {
        patient_id: initialData.patient_id, // Add this
        procedure_id: parseInt(selectedProcedureId),
        physician: initialData.physician // Add this
      };
      await procedureService.updatePatientProcedure(procedureId, updateData)
      console.log('Procedure updated successfully!');
      onSuccess();
    } catch (error) {
      console.log('error updating procedure', error)
      setError('Failed to update procedure. Please try again.');
    }
  };

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
              <h2 className="modal-title">Edit Procedure</h2>
              <p className="modal-subtitle">Update procedure type</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3 className="section-title">Procedure Type</h3>

            <div className="form-field">
              <label htmlFor="procedure_id">
                <span className="label-text">Procedure</span>
                <span className="required">*</span>
              </label>
              <div className="select-wrapper">
                <select
                  id="procedure_id"
                  name="procedure_id"
                  value={selectedProcedureId}
                  onChange={handleChange}
                  className={error ? 'error' : ''}
                >
                  <option value="">Select a procedure</option>
                  {procedures.map(proc => (
                    <option key={proc.id} value={proc.id}>
                      {proc.procedure_name} ({proc.procedure_code})
                    </option>
                  ))}
                </select>
              </div>
              {error && (
                <span className="error-message">{error}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Update Procedure
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProcedureModal;