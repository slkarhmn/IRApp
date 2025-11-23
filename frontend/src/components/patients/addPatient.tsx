import { useState, type ChangeEvent, type FormEvent } from 'react';
import './AddPatientPage.css';
// @ts-expect-error fuck typescript
import { patientService } from "../../services/patientService";

export const AddPatientPage = () => {
  const [formData, setFormData] = useState({
    // Basic Information
    mrn: '',
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    phone: '',
    insurance: false,

    // Medical Information
    allergies: '',
    medications: '',
    medical_history: '',

    // Vital Signs
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate_bpm: '',
    temperature_celsius: '',
    respiratory_rate_breaths_per_min: '',
    oxygen_saturation_percent: '',
    weight_kg: '',
    height_cm: '',

    // Lab Results
    hemoglobin_gL: '',
    hematocrit_LL: '',
    platelet_count: '',
    white_blood_cell_count: '',
    creatinine: '',
    bun_mmolL: '',
    glucose_mmolL: '',
    inr: '',
    pt_seconds: '',
    ptt_seconds: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // Stop page refresh

    console.log(formData);  // See everything user entered

    // Send to API
    patientService.createPatient(formData);
  };

  const handleReset = () => {
    setFormData({
      mrn: '',
      first_name: '',
      last_name: '',
      age: '',
      gender: '',
      phone: '',
      insurance: false,
      allergies: '',
      medications: '',
      medical_history: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      heart_rate_bpm: '',
      temperature_celsius: '',
      respiratory_rate_breaths_per_min: '',
      oxygen_saturation_percent: '',
      weight_kg: '',
      height_cm: '',
      hemoglobin_gL: '',
      hematocrit_LL: '',
      platelet_count: '',
      white_blood_cell_count: '',
      creatinine: '',
      bun_mmolL: '',
      glucose_mmolL: '',
      inr: '',
      pt_seconds: '',
      ptt_seconds: ''
    });
  };

  return (
    <div className="add-patient-page">
      <div className="page-header">
        <h1 className="page-title">Add New Patient</h1>
      </div>

      <form onSubmit={handleSubmit} className="patient-form">
        
        {/* Basic Information Card */}
        <div className="info-card">
          <h2 className="card-title">Contact Information</h2>
          <div className="card-content">
            <div className="form-row">
              <div className="form-field">
                <label>MRN</label>
                <input
                  type="text"
                  name="mrn"
                  value={formData.mrn}
                  onChange={handleChange}
                  placeholder="123-432-234-787"
                />
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(+971) 00 000 0000"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter first name"
                />
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="35"
                />
              </div>
              <div className="form-field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field checkbox-field">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="insurance"
                    checked={formData.insurance}
                    onChange={handleChange}
                  />
                  <span className="checkbox-label">Has Insurance</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Medical Information Card */}
        <div className="info-card">
          <h2 className="card-title">Medical Information</h2>
          <div className="card-content">
            <div className="form-field full-width">
              <label>Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Penicillin, Beta-Blockers..."
                rows={2}
              />
            </div>

            <div className="form-field full-width">
              <label>Medications</label>
              <textarea
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                placeholder="Aspirin, Beta-Blockers..."
                rows={2}
              />
            </div>

            <div className="form-field full-width">
              <label>Medical History</label>
              <textarea
                name="medical_history"
                value={formData.medical_history}
                onChange={handleChange}
                placeholder="CardioVascular disease..."
                rows={3}
              />
            </div>
          </div>
        </div>

        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", gap:40,}}>
          {/* Vitals Card */}
          <div className="lv-box">
            <h2 className="card-title">Vitals</h2>
            <div className="card-content vitals-grid">
              <div className="vital-item">
                <span className="vital-label">Systolic blood pressure</span>
              </div>
              <div className="form-field compact">
                <input
                  type="text"
                  name="blood_pressure_systolic"
                  value={formData.blood_pressure_systolic}
                  onChange={handleChange}
                  placeholder="120"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Diastolic blood pressure</span>
              </div>
              <div className="form-field compact">
                <input
                  type="text"
                  name="blood_pressure_diastolic"
                  value={formData.blood_pressure_diastolic}
                  onChange={handleChange}
                  placeholder="80"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Heart rate</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  name="heart_rate_bpm"
                  value={formData.heart_rate_bpm}
                  onChange={handleChange}
                  placeholder="72"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Temperature</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="temperature_celsius"
                  value={formData.temperature_celsius}
                  onChange={handleChange}
                  placeholder="37.0"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Respiratory rate</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  name="respiratory_rate_breaths_per_min"
                  value={formData.respiratory_rate_breaths_per_min}
                  onChange={handleChange}
                  placeholder="16"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Oxygen saturation</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="oxygen_saturation_percent"
                  value={formData.oxygen_saturation_percent}
                  onChange={handleChange}
                  placeholder="98"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Weight (kg)</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  placeholder="70.0"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Height (cm)</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  placeholder="170.0"
                />
              </div>
            </div>
          </div>

          {/* Lab Values Card */}
          <div className="lv-box">
            <h2 className="card-title">Lab Values</h2>
            <div className="card-content vitals-grid">
              <div className="vital-item">
                <span className="vital-label">Hemoglobin</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="hemoglobin_gL"
                  value={formData.hemoglobin_gL}
                  onChange={handleChange}
                  placeholder="140"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Hematocrit</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.01"
                  name="hematocrit_LL"
                  value={formData.hematocrit_LL}
                  onChange={handleChange}
                  placeholder="0.42"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Platelet count</span>
              </div>
              <div className="form-field compact">
                <input
                  type="text"
                  name="platelet_count"
                  value={formData.platelet_count}
                  onChange={handleChange}
                  placeholder="250"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">White blood cell count</span>
              </div>
              <div className="form-field compact">
                <input
                  type="text"
                  name="white_blood_cell_count"
                  value={formData.white_blood_cell_count}
                  onChange={handleChange}
                  placeholder="7.5"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Creatinine</span>
              </div>
              <div className="form-field compact">
                <input
                  type="text"
                  name="creatinine"
                  value={formData.creatinine}
                  onChange={handleChange}
                  placeholder="90"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Bun</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="bun_mmolL"
                  value={formData.bun_mmolL}
                  onChange={handleChange}
                  placeholder="5.0"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Glucose</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="glucose_mmolL"
                  value={formData.glucose_mmolL}
                  onChange={handleChange}
                  placeholder="5.5"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Inr</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="inr"
                  value={formData.inr}
                  onChange={handleChange}
                  placeholder="1.0"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Pt</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="pt_seconds"
                  value={formData.pt_seconds}
                  onChange={handleChange}
                  placeholder="12.0"
                />
              </div>

              <div className="vital-item">
                <span className="vital-label">Ptt</span>
              </div>
              <div className="form-field compact">
                <input
                  type="number"
                  step="0.1"
                  name="ptt_seconds"
                  value={formData.ptt_seconds}
                  onChange={handleChange}
                  placeholder="30.0"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" onClick={handleReset} className="btn-clear">
            Clear Form
          </button>
          <button type="submit" className="btn-submit">
            Add Patient
          </button>
        </div>
      </form>
    </div>
  );
};