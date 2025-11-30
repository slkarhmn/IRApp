import logging
from flask_restx import Namespace, Resource, fields
from flask import request
from datetime import datetime, timezone
from app.extensions.database import db
from app.models.patient import Patient
from app.schemas.patient_schema import PatientSchema

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

patient_ns = Namespace('patients', description='Patient records')

patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)


patient_model = patient_ns.model('Patient', {
    'mrn': fields.String(required=True, description='Medical Record Number'),
    'first_name': fields.String(required=True, description='First name of the patient'),
    'last_name': fields.String(required=True, description='Last name of the patient'),
    'age': fields.Integer(required=True, description='Age of the patient'),
    'gender': fields.String(required=True, description='Gender of the patient'),
    'phone': fields.String(description='Phone number of the patient'),
    'insurance': fields.Boolean(description='Whether the patient has insurance'),
    'allergies': fields.String(description='Patient allergies'),
    'medications': fields.String(description='Current medications'),
    'medical_history': fields.Raw(description='Medical history in JSON format'),
    # Optional vitals
    'blood_pressure_systolic': fields.String(description='Systolic blood pressure'),
    'blood_pressure_diastolic': fields.String(description='Diastolic blood pressure'),
    'heart_rate_bpm': fields.Integer(description='Heart rate in bpm'),
    'temperature_celsius': fields.Float(description='Temperature in Celsius'),
    'respiratory_rate_breaths_per_min': fields.Integer(description='Respiratory rate in breaths per minute'),
    'oxygen_saturation_percent': fields.Float(description='Oxygen saturation percentage'),
    'weight_kg': fields.Float(description='Weight in kilograms'),
    'height_cm': fields.Float(description='Height in centimeters'),
    # Optional lab results
    'hemoglobin_gL': fields.Float(description='Hemoglobin g/L'),
    'hematocrit_LL': fields.Float(description='Hematocrit L/L'),
    'platelet_count': fields.String(description='Platelet count'),
    'white_blood_cell_count': fields.String(description='White blood cell count'),
    'creatinine': fields.String(description='Creatinine level'),
    'bun_mmolL': fields.Float(description='BUN mmol/L'),
    'glucose_mmolL': fields.Float(description='Glucose mmol/L'),
    'inr': fields.Float(description='INR'),
    'pt_seconds': fields.Float(description='Prothrombin time in seconds'),
    'ptt_seconds': fields.Float(description='Partial thromboplastin time in seconds')
})


patient_vitals_model = patient_ns.model('PatientVitals', {
    'blood_pressure_systolic': fields.String(),
    'blood_pressure_diastolic': fields.String(),
    'heart_rate_bpm': fields.Integer(),
    'temperature_celsius': fields.Float(),
    'respiratory_rate_breaths_per_min': fields.Integer(),
    'oxygen_saturation_percent': fields.Float(),
    'weight_kg': fields.Float(),
    'height_cm': fields.Float()
})

patient_labs_model = patient_ns.model('PatientLabs', {
    'hemoglobin_gL': fields.Float(),
    'hematocrit_LL': fields.Float(),
    'platelet_count': fields.String(),
    'white_blood_cell_count': fields.String(),
    'creatinine': fields.String(),
    'bun_mmolL': fields.Float(),
    'glucose_mmolL': fields.Float(),
    'inr': fields.Float(),
    'pt_seconds': fields.Float(),
    'ptt_seconds': fields.Float()
})

def update_patient_from_data(patient, data):
    for field in data:
        if hasattr(patient, field):
            setattr(patient, field, data[field])
    patient.updated_date = datetime.now(timezone.utc)


@patient_ns.route('')
class PatientList(Resource):
    @patient_ns.doc('list_patients', description='Retrieve all patient records')
    def get(self):
        """List all patients"""
        logger.info("Fetching all patient records")
        patients = Patient.query.all()
        return patients_schema.dump(patients), 200
    
    @patient_ns.doc('create_patient', description='Create a new patient record')
    @patient_ns.expect(patient_model)
    def post(self):
        """Create a new patient"""
        json_data = request.get_json()
        logger.info("Creating a new patient record")

        if not json_data:
            logger.warning("No input data provided for patient creation")
            return {'message': 'No input data provided'}, 400

        try:
            data = patient_schema.load(json_data)
        except Exception as e:
            logger.error("Patient creation failed: %s", str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        now = datetime.now(timezone.utc)
        data.created_date = now
        data.updated_date = now

        db.session.add(data)
        db.session.commit()
        logger.info("Patient created successfully: MRN=%s", data.mrn)
        return patient_schema.dump(data), 201


@patient_ns.route('/<int:id>')
@patient_ns.response(404, 'Patient not found')
class PatientResource(Resource):

    @patient_ns.doc('get_patient', description='Retrieve a patient record by its ID')
    def get(self, id):
        """Get patient by ID"""
        logger.info("Fetching patient with ID: %d", id)
        patient = Patient.query.get_or_404(id)
        return patient_schema.dump(patient), 200

    @patient_ns.doc('update_patient', description='Update a patient record by its ID')
    @patient_ns.expect(patient_model)
    def put(self, id):
        """Update a patient"""
        logger.info("Updating patient with ID: %d", id)
        patient = Patient.query.get_or_404(id)
        json_data = request.get_json()

        if not json_data:
            logger.warning("No input data provided for patient update: ID %d", id)
            return {'message': 'No input data provided'}, 400

        try:
            data = patient_schema.load(json_data, partial=True)
        except Exception as e:
            logger.error("Patient update failed for ID %d: %s", id, str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        update_patient_from_data(patient, data)
        db.session.commit()
        logger.info("Patient updated successfully: ID %d", id)
        return patient_schema.dump(patient), 200

    @patient_ns.doc('delete_patient', description='Delete a patient record by its ID')
    def delete(self, id):
        """Delete a patient"""
        logger.info("Deleting patient with ID: %d", id)
        patient = Patient.query.get_or_404(id)
        db.session.delete(patient)
        db.session.commit()
        logger.info("Patient deleted successfully: ID %d", id)
        return '', 204

@patient_ns.route('/<int:id>/vitals')
@patient_ns.response(404, 'Patient not found')
class PatientVitals(Resource):
    @patient_ns.doc('get_patient_vitals', description='Retrieve the vital signs for a specific patient')
    @patient_ns.marshal_with(patient_vitals_model)
    def get(self, id):
        """Get patient vital signs"""
        patient = Patient.query.get_or_404(id)
        return patient

    @patient_ns.doc('update_patient_vitals', description='Update the vital signs for a specific patient')
    @patient_ns.expect(patient_vitals_model)
    @patient_ns.marshal_with(patient_vitals_model)
    def put(self, id):
        """Update patient vital signs"""
        patient = Patient.query.get_or_404(id)
        data = request.get_json() or {}

        # Call Patient.update_vitals()
        patient.update_vitals(
            blood_pressure_systolic=data.get('blood_pressure_systolic'),
            blood_pressure_diastolic=data.get('blood_pressure_diastolic'),
            heart_rate_bpm=data.get('heart_rate_bpm'),
            temperature_celsius=data.get('temperature_celsius'),
            respiratory_rate_breaths_per_min=data.get('respiratory_rate_breaths_per_min'),
            oxygen_saturation_percent=data.get('oxygen_saturation_percent')
        )

        db.session.commit()
        return patient, 200

@patient_ns.route('/<int:id>/labs')
@patient_ns.response(404, 'Patient not found')
class PatientLabs(Resource):
    @patient_ns.doc('get_patient_labs', description='Retrieve the lab results for a specific patient')
    @patient_ns.marshal_with(patient_labs_model)
    def get(self, id):
        """Get patient lab results"""
        patient = Patient.query.get_or_404(id)
        return patient

    @patient_ns.doc('update_patient_labs', description='Update the lab results for a specific patient')
    @patient_ns.expect(patient_labs_model)
    @patient_ns.marshal_with(patient_labs_model)
    def put(self, id):
        """Update patient lab results"""
        patient = Patient.query.get_or_404(id)
        data = request.get_json() or {}

        patient.update_lab_results(
            hemoglobin_gL=data.get('hemoglobin_gL'),
            hematocrit_LL=data.get('hematocrit_LL'),
            platelet_count=data.get('platelet_count'),
            white_blood_cell_count=data.get('white_blood_cell_count'),
            creatinine=data.get('creatinine'),
            bun_mmolL=data.get('bun_mmolL'),
            glucose_mmolL=data.get('glucose_mmolL'),
            inr=data.get('inr'),
            pt_seconds=data.get('pt_seconds'),
            ptt_seconds=data.get('ptt_seconds')
        )

        db.session.commit()
        return patient, 200
