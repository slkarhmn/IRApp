from marshmallow import Schema, fields, post_load
from app.models.checklist import ProcedurePlanning, SignIn, SignOut

class ProcedurePlanningSchema(Schema):
    id = fields.Int(dump_only=True)
    procedure_id = fields.Int(required=True)

    discussed_with_referring_physician = fields.Bool()
    imaging_studies_reviewed = fields.Bool()
    relevant_medical_history = fields.Str(allow_none=True)
    informed_consent = fields.Bool()
    prophylaxis = fields.Bool()
    tools_requested_and_present = fields.Str(allow_none=True)
    fasting_order = fields.Bool()
    relevant_lab_tests = fields.Str(allow_none=True)
    anaesthetist_necessary = fields.Bool()
    anticoagulant_stopped = fields.Bool()
    post_precedural_bed_required = fields.Bool()
    contrast_allergy_prophylaxis_necessary = fields.Bool()

    @post_load
    def make_procedure_planning(self, data, **kwargs):
        return ProcedurePlanning(**data)


class SignInSchema(Schema):
    id = fields.Int(dump_only=True)
    procedure_id = fields.Int(required=True)

    team_members_introduced = fields.Str(allow_none=True)
    records_given_to_patient = fields.Str(allow_none=True)
    correct_patient = fields.Bool()
    correct_side = fields.Bool()
    correct_site = fields.Bool()
    patient_fasting_order_followed = fields.Bool()
    iv_access_necessary = fields.Bool()
    monitoring_equipment_attached = fields.Bool()
    checked_lab_tests = fields.Str(allow_none=True)
    allergies_checked = fields.Bool()
    prophylaxis_checked = fields.Bool()
    drugs_administered = fields.Str(allow_none=True)
    complications_discussed = fields.Str(allow_none=True)
    consent_obtained = fields.Bool()

    @post_load
    def make_sign_in(self, data, **kwargs):
        return SignIn(**data)


class SignOutSchema(Schema):
    id = fields.Int(dump_only=True)
    procedure_id = fields.Int(required=True)

    post_op_note = fields.Str(allow_none=True)
    vital_signs_normal = fields.Bool()
    medications_recorded = fields.Str(allow_none=True)
    contrast_media_recorded = fields.Str(allow_none=True)
    lab_tests_requested = fields.Bool()
    samples_labelled = fields.Bool()
    samples_sent_to_lab = fields.Bool()
    procedure_results_discussed_with_patients = fields.Str(allow_none=True)
    post_discharge_instructions_given_to_patient = fields.Str(allow_none=True)
    follow_up_appt_made = fields.Bool()
    follow_up_appt_date = fields.DateTime(allow_none=True)
    procedure_results_communicated_to_referring_physician = fields.Bool()

    @post_load
    def make_sign_out(self, data, **kwargs):
        return SignOut(**data)
