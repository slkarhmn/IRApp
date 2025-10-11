from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.patient import Patient
from app.schemas.procedure_schema import PatientProcedureSchema 
from app.config import db

class PatientSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Patient
        load_instance = True
        include_relationships = True
        include_fk = True 
        sqla_session = db.session

    procedures = fields.Nested(PatientProcedureSchema, many=True, dump_only=True)
