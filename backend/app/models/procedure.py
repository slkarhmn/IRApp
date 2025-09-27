from app.config import db
from sqlalchemy import Integer, DateTime, String, Enum as SQLEnum, ForeignKey, Column, JSON
from enum import Enum as PyEnum

class Status(str, PyEnum):
    scheduled = "Scheduled"
    ready = "Ready"
    completed = "Completed"
    cancelled = "Cancelled"
    
class Urgency(str, PyEnum):
    routine = "Routine"
    urgent = "urgent"
    emergent = "emergent"

class PatientProcedures(db.Model):
    __tablename__ = 'patient_procedures'

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer)

    procedure_name = Column(String)
    procedure_code = Column(String)
    category = Column(String)

    scheduled_date = Column(DateTime)
    physician = Column(String)

    status = Column(SQLEnum('scheduled', 'ready', 'completed', 'cancalled')) 
    urgency = Column(SQLEnum('routine', 'urgent', 'emergent'))

    prep_requirements = Column(JSON) 

    created_date = Column(DateTime)
    updated_date = Column(DateTime)

class Procedures(db.Model):
    __tablename__ = 'procedures'
    
    id = Column(Integer, primary_key=True)
    procedure_name = Column(String)
    procedure_code = Column(String)
    category = Column(String)
    specialised_checklist = Column(JSON)