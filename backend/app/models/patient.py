from app.config import db
from sqlalchemy import Column, Integer, String, JSON, Float, DateTime, Text, Boolean

class Patient(db.Model):
    __tablename__ = 'patients'

    id = Column(Integer, primary_key=True)
    mrn = Column(String(20), unique=True, nullable=False, index=True)
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
    
    procedure_history = Column(JSON)
 
    created_date = Column(DateTime)
    updated_date = Column(DateTime)
