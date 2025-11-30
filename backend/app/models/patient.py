from app.extensions.database import db
from sqlalchemy import Column, Integer, String, JSON, Float, DateTime, Text, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class Patient(db.Model):
    __tablename__ = 'patients'
    __table_args__ = (
        UniqueConstraint('mrn', name='uq_patients_mrn'),
    )

    id = Column(Integer, primary_key=True)

    mrn = Column(String(20), nullable=False, index=True)
    first_name = Column(String(50), nullable=False, index=True)
    last_name = Column(String(50), nullable=False, index=True)
    age = Column(Integer, nullable=False)
    gender = Column(String(10), nullable=False)

    phone = Column(String(20), nullable=False)  
    insurance = Column(Boolean, nullable=False)   

    allergies = Column(Text, nullable=False)       

    medications = Column(Text, nullable=True)
    medical_history = Column(JSON, nullable=True)
    blood_pressure_systolic = Column(String(10), nullable=True)
    blood_pressure_diastolic = Column(String(10), nullable=True)
    heart_rate_bpm = Column(Integer, nullable=True)
    temperature_celsius = Column(Float, nullable=True)
    respiratory_rate_breaths_per_min = Column(Integer, nullable=True)
    oxygen_saturation_percent = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    hemoglobin_gL = Column(Float, nullable=True)
    hematocrit_LL = Column(Float, nullable=True)
    platelet_count = Column(String, nullable=True)
    white_blood_cell_count = Column(String, nullable=True)
    creatinine = Column(String, nullable=True)
    bun_mmolL = Column(Float, nullable=True)
    glucose_mmolL = Column(Float, nullable=True)
    inr = Column(Float, nullable=True)
    pt_seconds = Column(Float, nullable=True)
    ptt_seconds = Column(Float, nullable=True)

    created_date = Column(DateTime)
    updated_date = Column(DateTime)


    procedures = relationship('PatientProcedures')

    def __init__(
        self,
        mrn,
        first_name,
        last_name,
        age,
        gender,
        phone,
        insurance,
        allergies,
        medications=None,
        medical_history=None,
        blood_pressure_systolic=None,
        blood_pressure_diastolic=None,
        heart_rate_bpm=None,
        temperature_celsius=None,
        respiratory_rate_breaths_per_min=None,
        oxygen_saturation_percent=None,
        weight_kg=None,
        height_cm=None,
        hemoglobin_gL=None,
        hematocrit_LL=None,
        platelet_count=None,
        white_blood_cell_count=None,
        creatinine=None,
        bun_mmolL=None,
        glucose_mmolL=None,
        inr=None,
        pt_seconds=None,
        ptt_seconds=None
    ):

        self.mrn = mrn
        self.first_name = first_name
        self.last_name = last_name
        self.age = age
        self.gender = gender
        self.phone = phone
        self.insurance = insurance

        self.allergies = allergies
        self.medications = medications
        self.medical_history = medical_history

        self.blood_pressure_systolic = blood_pressure_systolic
        self.blood_pressure_diastolic = blood_pressure_diastolic
        self.heart_rate_bpm = heart_rate_bpm
        self.temperature_celsius = temperature_celsius
        self.respiratory_rate_breaths_per_min = respiratory_rate_breaths_per_min
        self.oxygen_saturation_percent = oxygen_saturation_percent
        self.weight_kg = weight_kg
        self.height_cm = height_cm

        self.hemoglobin_gL = hemoglobin_gL
        self.hematocrit_LL = hematocrit_LL
        self.platelet_count = platelet_count
        self.white_blood_cell_count = white_blood_cell_count
        self.creatinine = creatinine
        self.bun_mmolL = bun_mmolL
        self.glucose_mmolL = glucose_mmolL
        self.inr = inr
        self.pt_seconds = pt_seconds
        self.ptt_seconds = ptt_seconds

        now = datetime.now(timezone.utc)
        self.created_date = now
        self.updated_date = now

    def update_vitals(
        self,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        heart_rate_bpm,
        temperature_celsius,
        respiratory_rate_breaths_per_min,
        oxygen_saturation_percent
    ):
        self.blood_pressure_systolic = blood_pressure_systolic
        self.blood_pressure_diastolic = blood_pressure_diastolic
        self.heart_rate_bpm = heart_rate_bpm
        self.temperature_celsius = temperature_celsius
        self.respiratory_rate_breaths_per_min = respiratory_rate_breaths_per_min
        self.oxygen_saturation_percent = oxygen_saturation_percent
        self.updated_date = datetime.now(timezone.utc)

    def update_lab_results(
        self,
        hemoglobin_gL,
        hematocrit_LL,
        platelet_count,
        white_blood_cell_count,
        creatinine,
        bun_mmolL,
        glucose_mmolL,
        inr,
        pt_seconds,
        ptt_seconds
    ):
        self.hemoglobin_gL = hemoglobin_gL
        self.hematocrit_LL = hematocrit_LL
        self.platelet_count = platelet_count
        self.white_blood_cell_count = white_blood_cell_count
        self.creatinine = creatinine
        self.bun_mmolL = bun_mmolL
        self.glucose_mmolL = glucose_mmolL
        self.inr = inr
        self.pt_seconds = pt_seconds
        self.ptt_seconds = ptt_seconds
        self.updated_date = datetime.now(timezone.utc)
