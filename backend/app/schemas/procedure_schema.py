from app.models.procedure import Procedures, PatientProcedures
from checklist_schema import ProcedurePlanningSchema, SignInSchema, SignOutSchema
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
from app.schemas.checklist_schema import ProcedurePlanningSchema, SignInSchema, SignOutSchema
from app.schemas.procedure_schema import ProcedureSchema


class ProcedureSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Procedures
        load_instance = True
        include_relationships = False


class PatientProcedureSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PatientProcedures
        load_instance = True
        include_fk = True
        include_relationships = True

    procedure_planning = fields.Nested(ProcedurePlanningSchema)
    sign_in = fields.Nested(SignInSchema)
    sign_out = fields.Nested(SignOutSchema)

    procedure_details = fields.Nested(ProcedureSchema, attribute="procedure", dump_only=True)

    status = auto_field()
    urgency = auto_field()
