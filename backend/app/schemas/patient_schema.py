from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow import fields
from app.models.patient import Patient
from app.schemas.procedure_schema import PatientProcedureSchema
from app.extensions.database import db

class NullableFloat(fields.Float):
    def _deserialize(self, value, attr, data, **kwargs):
        if value in ("", None):
            return None
        return super()._deserialize(value, attr, data, **kwargs)

class NullableInt(fields.Integer):
    def _deserialize(self, value, attr, data, **kwargs):
        if value in ("", None):
            return None
        return super()._deserialize(value, attr, data, **kwargs)


class PatientSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Patient
        load_instance = True
        include_relationships = True
        include_fk = True
        sqla_session = db.session

    heart_rate_bpm = NullableInt(allow_none=True)
    respiratory_rate_breaths_per_min = NullableInt(allow_none=True)

    temperature_celsius = NullableFloat(allow_none=True)
    oxygen_saturation_percent = NullableFloat(allow_none=True)
    weight_kg = NullableFloat(allow_none=True)
    height_cm = NullableFloat(allow_none=True)
    hemoglobin_gL = NullableFloat(allow_none=True)
    hematocrit_LL = NullableFloat(allow_none=True)
    bun_mmolL = NullableFloat(allow_none=True)
    glucose_mmolL = NullableFloat(allow_none=True)
    inr = NullableFloat(allow_none=True)
    pt_seconds = NullableFloat(allow_none=True)
    ptt_seconds = NullableFloat(allow_none=True)

    procedures = fields.Nested(PatientProcedureSchema, many=True, dump_only=True)
