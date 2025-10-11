from app.config import db
from sqlalchemy import Column, Boolean, Text, Integer, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

class ProcedurePlanning(db.Model):
    __tablename__ = 'procedure_planning'
    __table_args__ = (
        UniqueConstraint('procedure_id', name='uq_procedure_planning_procedure_id'),
    )
    
    id = Column(Integer, primary_key=True)
    procedure_id = Column(Integer, ForeignKey('patient_procedures.id', name='patient_procedure_checklist_fk'))
    
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
    
    def __init__( 
        self,
        procedure_id,
        discussed_with_referring_physician=False,
        imaging_studies_reviewed=False,
        relevant_medical_history=None,
        informed_consent=False,
        prophylaxis=False,
        tools_requested_and_present=None,
        fasting_order=False,
        relevant_lab_tests=None,
        anaesthetist_necessary=False,
        anticoagulant_stopped=False,
        post_precedural_bed_required=False,
        contrast_allergy_prophylaxis_necessary=False
    ):
        self.procedure_id = procedure_id
        self.discussed_with_referring_physician = discussed_with_referring_physician
        self.imaging_studies_reviewed = imaging_studies_reviewed
        self.relevant_medical_history = relevant_medical_history
        self.informed_consent = informed_consent
        self.prophylaxis = prophylaxis
        self.tools_requested_and_present = tools_requested_and_present
        self.fasting_order = fasting_order
        self.relevant_lab_tests = relevant_lab_tests
        self.anaesthetist_necessary = anaesthetist_necessary
        self.anticoagulant_stopped = anticoagulant_stopped
        self.post_precedural_bed_required = post_precedural_bed_required
        self.contrast_allergy_prophylaxis_necessary = contrast_allergy_prophylaxis_necessary


class SignIn(db.Model):
    __tablename__ = 'sign_in'
    __table_args__ = (
        UniqueConstraint('procedure_id', name='uq_sign_in_procedure_id'),
    )
    
    id = Column(Integer, primary_key=True)
    procedure_id = Column(Integer, ForeignKey('patient_procedures.id', name='patient_procedure_sign_in_fk'))
    
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
    
    def __init__(
        self,
        procedure_id,
        team_members_introduced=None,
        records_given_to_patient=None,
        correct_patient=False,
        correct_side=False,
        correct_site=False,
        patient_fasting_order_followed=False,
        iv_access_necessary=False,
        monitoring_equipment_attached=False,
        checked_lab_tests=None,
        allergies_checked=False,
        prophylaxis_checked=False,
        drugs_administered=None,
        complications_discussed=None,
        consent_obtained=False
    ):
        self.procedure_id = procedure_id
        self.team_members_introduced = team_members_introduced
        self.records_given_to_patient = records_given_to_patient
        self.correct_patient = correct_patient
        self.correct_side = correct_side
        self.correct_site = correct_site
        self.patient_fasting_order_followed = patient_fasting_order_followed
        self.iv_access_necessary = iv_access_necessary
        self.monitoring_equipment_attached = monitoring_equipment_attached
        self.checked_lab_tests = checked_lab_tests
        self.allergies_checked = allergies_checked
        self.prophylaxis_checked = prophylaxis_checked
        self.drugs_administered = drugs_administered
        self.complications_discussed = complications_discussed
        self.consent_obtained = consent_obtained


class SignOut(db.Model):
    __tablename__ = 'sign_out'
    __table_args__ = (
        UniqueConstraint('procedure_id', name='uq_sign_out_procedure_id'),
    )
    
    id = Column(Integer, primary_key=True)
    procedure_id = Column(Integer, ForeignKey('patient_procedures.id', name='patient_procedure_sign_out_fk'))
    
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
    
    def __init__(
        self,
        procedure_id,
        post_op_note=None,
        vital_signs_normal=False,
        medications_recorded=None,
        contrast_media_recorded=None,
        lab_tests_requested=False,
        samples_labelled=False,
        samples_sent_to_lab=False,
        procedure_results_discussed_with_patients=None,
        post_discharge_instructions_given_to_patient=None,
        follow_up_appt_made=False,
        follow_up_appt_date=None,
        procedure_results_communicated_to_referring_physician=False
    ):
        self.procedure_id = procedure_id
        self.post_op_note = post_op_note
        self.vital_signs_normal = vital_signs_normal
        self.medications_recorded = medications_recorded
        self.contrast_media_recorded = contrast_media_recorded
        self.lab_tests_requested = lab_tests_requested
        self.samples_labelled = samples_labelled
        self.samples_sent_to_lab = samples_sent_to_lab
        self.procedure_results_discussed_with_patients = procedure_results_discussed_with_patients
        self.post_discharge_instructions_given_to_patient = post_discharge_instructions_given_to_patient
        self.follow_up_appt_made = follow_up_appt_made
        self.follow_up_appt_date = follow_up_appt_date
        self.procedure_results_communicated_to_referring_physician = procedure_results_communicated_to_referring_physician
