from app.config import db
from sqlalchemy import Integer, DateTime, String, Enum as SQLEnum, ForeignKey, Column, JSON
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship

class Status(str, PyEnum):
    scheduled = "Scheduled"
    ready = "Ready"
    completed = "Completed"
    cancelled = "Cancelled"
    
class Urgency(str, PyEnum):
    routine = "Routine"
    urgent = "Urgent"
    emergent = "Emergent"

class PatientProcedures(db.Model):
    __tablename__ = 'patient_procedures'

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    
    procedure_name = Column(String(100))
    procedure_code = Column(String(25), ForeignKey('procedures.procedure_code'))

    scheduled_date = Column(DateTime)
    
    physician = Column(String(50))

    status = Column(SQLEnum(Status, name="status_enum")) 
    urgency = Column(SQLEnum(Urgency, name="urgency_enum"))

    prep_requirements = Column(JSON) 

    created_date = Column(DateTime)
    updated_date = Column(DateTime)
    
    procedure_planning = relationship('ProcedurePlanning', uselist=False, back_populates='patient_procedure')
    sign_in = relationship('SignIn', uselist=False, back_populates='patient_procedure')
    sign_out = relationship('SignOut', uselist=False, back_populates='patient_procedure')

    
    def __init__(self, patient_id, procedure_name, procedure_code, physician, status, urgency, prep_requirements, created_date):
        super().__init__()
        #TODO: finish this method
    

class Procedures(db.Model):
    __tablename__ = 'procedures'
    
    id = Column(Integer, primary_key=True)
    procedure_name = Column(String(100))
    procedure_code = Column(String(25), index=True, unique=True)
    specialised_checklist = Column(JSON)