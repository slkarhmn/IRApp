from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.checklist import ProcedurePlanning, SignIn, SignOut
from app.extensions.database import db

class ProcedurePlanningSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = ProcedurePlanning
        load_instance = True
        include_fk = True
        sqla_session = db.session

    patient_procedure = fields.Nested('PatientProcedureSchema', exclude=("procedure_planning",))


class SignInSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = SignIn
        load_instance = True
        include_fk = True
        sqla_session = db.session

    patient_procedure = fields.Nested('PatientProcedureSchema', exclude=("sign_in",))


class SignOutSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = SignOut
        load_instance = True
        include_fk = True
        sqla_session = db.session

    patient_procedure = fields.Nested('PatientProcedureSchema', exclude=("sign_out",))
