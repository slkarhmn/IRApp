from app.config import db
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
    phone = Column(String(20))
    insurance = Column(Boolean)

    allergies = Column(Text)
    medications = Column(Text)
    medical_history = Column(JSON)

    blood_pressure_systolic = Column(String(10))
    blood_pressure_diastolic = Column(String(10))
    heart_rate = Column(Integer)
    temperature = Column(Float)
    respiratory_rate = Column(Integer)
    oxygen_saturation = Column(Float)
    weight_kg = Column(Float)
    height_cm = Column(Float)

    hemoglobin = Column(Float)
    hematocrit = Column(Float)
    platelet_count = Column(Float)
    white_blood_cell_count = Column(Float)
    creatinine = Column(Float)
    bun = Column(Float)
    glucose = Column(Float)
    inr = Column(Float)
    pt = Column(Float)
    ptt = Column(Float)
 
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
        phone=None,
        insurance=False,
        allergies=None,
        medications=None,
        medical_history=None,
        blood_pressure_systolic=None,
        blood_pressure_diastolic=None,
        heart_rate=None,
        temperature=None,
        respiratory_rate=None,
        oxygen_saturation=None,
        weight_kg=None,
        height_cm=None,
        hemoglobin=None,
        hematocrit=None,
        platelet_count=None,
        white_blood_cell_count=None,
        creatinine=None,
        bun=None,
        glucose=None,
        inr=None,
        pt=None,
        ptt=None
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
        self.heart_rate = heart_rate
        self.temperature = temperature
        self.respiratory_rate = respiratory_rate
        self.oxygen_saturation = oxygen_saturation
        self.weight_kg = weight_kg
        self.height_cm = height_cm

        self.hemoglobin = hemoglobin
        self.hematocrit = hematocrit
        self.platelet_count = platelet_count
        self.white_blood_cell_count = white_blood_cell_count
        self.creatinine = creatinine
        self.bun = bun
        self.glucose = glucose
        self.inr = inr
        self.pt = pt
        self.ptt = ptt

        now = datetime.now(timezone.utc)
        self.created_date = now
        self.updated_date = now

    
    def update_vitals(self, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, temperature, respiratory_rate, oxygen_saturation):
        self.blood_pressure_systolic = blood_pressure_systolic
        self.blood_pressure_diastolic = blood_pressure_diastolic
        self.heart_rate = heart_rate
        self.temperature = temperature
        self.respiratory_rate = respiratory_rate
        self.oxygen_saturation = oxygen_saturation
        self.updated_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S')
        
    def update_lab_results(self, hemoglobin, hematocrit, platelet_count, white_blood_cell_count, creatinine, bun, glucose, inr, pt, ptt):
        self.hemoglobin = hemoglobin
        self.hematocrit = hematocrit
        self.platelet_count = platelet_count
        self.white_blood_cell_count = white_blood_cell_count
        self.creatinine = creatinine
        self.bun = bun
        self.glucose = glucose
        self.inr = inr
        self.pt = pt
        self.ptt = ptt
        self.updated_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S')
