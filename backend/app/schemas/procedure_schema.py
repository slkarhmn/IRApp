from marshmallow import Schema, fields, post_load
from marshmallow.validate import Length
from app.models.procedure import Procedures, PatientProcedures, Status, Urgency
from checklist_schema import ProcedurePlanningSchema, SignInSchema, SignOutSchema


class ProcedureSchema(Schema):
    id = fields.Int(dump_only=True)
    procedure_name = fields.Str(required=True)
    procedure_code = fields.Str(required=True)
    specialised_checklist = fields.Dict()  # JSON as dict

    @post_load
    def make_procedure(self, data, **kwargs):
        return Procedures(**data)

class PatientProcedureSchema(Schema):
    id = fields.Int(dump_only=True)
    patient_id = fields.Int(required=True)

    procedure_name = fields.Str(required=True, validate=Length(max=100))
    procedure_code = fields.Str(required=True, validate=Length(max=25))

    # Optional: include full procedure details on dump
    procedure_details = fields.Nested(ProcedureSchema, dump_only=True)

    scheduled_date = fields.DateTime(required=False, allow_none=True)
    physician = fields.Str(required=True, validate=Length(max=50))

    status = fields.Enum(Status, by_value=True, required=True)
    urgency = fields.Enum(Urgency, by_value=True, required=True)

    prep_requirements = fields.Dict(required=False)  # Handles JSON

    created_date = fields.DateTime(dump_only=True)
    updated_date = fields.DateTime(dump_only=True)

    # Related one-to-one planning/sign-in/sign-out (optional)
    # You can define schemas for these and include them if needed
    
    procedure_planning = fields.Nested(ProcedurePlanningSchema, dump_only=True)
    sign_in = fields.Nested(SignInSchema, dump_only=True)
    sign_out = fields.Nested(SignOutSchema, dump_only=True)

    @post_load
    def make_patient_procedure(self, data, **kwargs):
        return PatientProcedures(**data)
