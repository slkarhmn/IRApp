from app.extensions.database import db
from sqlalchemy import Integer, DateTime, String, Enum as SQLEnum, ForeignKey, Column, JSON, UniqueConstraint
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

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
    __table_args__ = (
        UniqueConstraint('patient_id', 'procedure_code', 'scheduled_date', name='uq_patient_procedure_schedule'),
    )

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id', name='procedure_to_patient_fk'))
    
    procedure_name = Column(String(100))
    procedure_code = Column(String(25), ForeignKey('procedures.procedure_code', name='procedure_code_fk'))

    scheduled_date = Column(DateTime) #THIS WILL BE DATE AND TIME
    
    physician = Column(String(50))

    status = Column(SQLEnum(Status, name="status_enum")) 
    urgency = Column(SQLEnum(Urgency, name="urgency_enum"))

    prep_requirements = Column(JSON) 

    created_date = Column(DateTime) #THIS WILL BE DATE AND TIME
    updated_date = Column(DateTime) #THIS WILL BE DATE AND TIME!!!!!!!!!
    
    procedure_planning = relationship('ProcedurePlanning', uselist=False, back_populates='patient_procedure')
    sign_in = relationship('SignIn', uselist=False, back_populates='patient_procedure')
    sign_out = relationship('SignOut', uselist=False, back_populates='patient_procedure')

    
    def __init__(
        self,
        patient_id,
        procedure_name,
        procedure_code,
        physician,
        status=Status.scheduled,
        urgency=Urgency.routine,
        prep_requirements=None,
        scheduled_date=None,
        created_date=None,
        updated_date=None
    ):
        self.patient_id = patient_id
        self.procedure_name = procedure_name
        self.procedure_code = procedure_code
        self.physician = physician
        self.status = status
        self.urgency = urgency
        self.prep_requirements = prep_requirements or {}
        self.scheduled_date = scheduled_date

        now = datetime.now(timezone.utc)
        self.created_date = created_date or now
        self.updated_date = updated_date or now
    

class Procedures(db.Model):
    __tablename__ = 'procedures'
    __table_args__ = (
        UniqueConstraint('procedure_code', name='uq_procedures_procedure_code'),
    )
    
    id = Column(Integer, primary_key=True)
    procedure_name = Column(String(100))
    procedure_code = Column(String(25), index=True)
    specialised_checklist = Column(JSON)
    
    def __init__(self, procedure_name, procedure_code, specialised_checklist=None):
        self.procedure_name = procedure_name
        self.procedure_code = procedure_code
        self.specialised_checklist = specialised_checklist or {}
