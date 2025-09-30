from marshmallow import Schema, fields, post_load
from app.models.patient import Patient
# Optional: Import PatientProcedureSchema if you want to nest procedures
# from app.schemas.patient_procedure import PatientProcedureSchema

class PatientSchema(Schema):
    id = fields.Int(dump_only=True)
    mrn = fields.Str(required=True)
    first_name = fields.Str(required=True)
    last_name = fields.Str(required=True)
    age = fields.Int(required=True)
    gender = fields.Str(required=True)
    phone = fields.Str(allow_none=True)
    insurance = fields.Bool()

    allergies = fields.Str(allow_none=True)
    medications = fields.Str(allow_none=True)
    medical_history = fields.Dict(allow_none=True)  # JSON

    # Vitals
    blood_pressure_systolic = fields.Str(allow_none=True)
    blood_pressure_diastolic = fields.Str(allow_none=True)
    heart_rate = fields.Int(allow_none=True)
    temperature = fields.Float(allow_none=True)
    respiratory_rate = fields.Int(allow_none=True)
    oxygen_saturation = fields.Float(allow_none=True)
    weight_kg = fields.Float(allow_none=True)
    height_cm = fields.Float(allow_none=True)

    # Labs
    hemoglobin = fields.Float(allow_none=True)
    hematocrit = fields.Float(allow_none=True)
    platelet_count = fields.Float(allow_none=True)
    white_blood_cell_count = fields.Float(allow_none=True)
    creatinine = fields.Float(allow_none=True)
    bun = fields.Float(allow_none=True)
    glucose = fields.Float(allow_none=True)
    inr = fields.Float(allow_none=True)
    pt = fields.Float(allow_none=True)
    ptt = fields.Float(allow_none=True)

    created_date = fields.DateTime(dump_only=True)
    updated_date = fields.DateTime(dump_only=True)

    # Optional: nest related patient procedures
    # procedures = fields.Nested(PatientProcedureSchema, many=True, dump_only=True)

    @post_load
    def make_patient(self, data, **kwargs):
        return Patient(**data)
