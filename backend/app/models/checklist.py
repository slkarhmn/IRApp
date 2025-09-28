from app.config import db
from sqlalchemy import Column, Boolean, Text, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship

class ProcedurePlanning(db.Model):
    __tablename__ = 'procedure_planning'
    
    id = Column(Integer, primary_key=True)
    procedure_id = Column(Integer, ForeignKey('patient_procedures.id'), unique=True)
    
    discussed_with_referring_physician= Column(Boolean)
    imaging_studies_reviewed = Column(Boolean)
    relevant_medical_history = Column(Text)
    informed_consent = Column(Boolean)
    prophylaxis = Column(Boolean)
    tools_requested_and_present = Column(Text)
    fasting_order = Column(Boolean)
    relevant_lab_tests = Column(Text)
    anaesthetist_necessary = Column(Boolean)
    anticoagulant_stopped = Column(Boolean)
    post_precedural_bed_required = Column(Boolean)
    contrast_allergy_prophylaxis_necessary = Column(Boolean)
    
    patient_procedure = relationship('PatientProcedures', back_populates='procedure_planning')

class SignIn(db.Model):
    __tablename__ = 'sign_in'
    
    id = Column(Integer, primary_key=True)
    procedure_id = Column(Integer, ForeignKey('patient_procedures.id'), unique=True)
    
    team_members_introduced = Column(Text)
    records_given_to_patient = Column(Text)
    correct_patient = Column(Boolean)
    correct_side = Column(Boolean)
    correct_site = Column(Boolean)
    patient_fasting_order_followed = Column(Boolean)
    iv_access_necessary = Column(Boolean)
    monitoring_equipment_attached = Column(Boolean)
    checked_lab_tests = Column(Text)
    allergies_checked = Column(Boolean)
    prophylaxis_checked = Column(Boolean)
    drugs_administered = Column(Text)
    complications_discussed = Column(Text)
    consent_obtained = Column(Boolean)   
    
    patient_procedure = relationship('PatientProcedures', back_populates='sign_in')
    
class SignOut(db.Model):
    __tablename__ = 'sign_out'
    
    id = Column(Integer, primary_key=True)
    procedure_id = Column(Integer, ForeignKey('patient_procedures.id'), unique=True)
    
    post_op_note = Column(Text)
    vital_signs_normal = Column(Boolean)
    medications_recorded = Column(Text)
    contrast_media_recorded = Column(Text)
    lab_tests_requested = Column(Boolean)
    samples_labelled = Column(Boolean)
    samples_sent_to_lab = Column(Boolean)
    procedure_results_discussed_with_patients = Column(Text)
    post_discharge_instructions_given_to_patient = Column(Text)
    follow_up_appt_made = Column(Boolean)
    follow_up_appt_date = Column(DateTime)
    procedure_results_communicated_to_referring_physician = Column(Boolean)
    
    patient_procedure = relationship('PatientProcedures', back_populates='sign_out')
    