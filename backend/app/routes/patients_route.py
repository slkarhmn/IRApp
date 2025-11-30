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
    def post(self):
        """Create a new patient"""
        json_data = request.get_json()
        logger.info("Creating a new patient record")

        if not json_data:
            return {'message': 'No input data provided'}, 400

        try:
            patient: Patient = patient_schema.load(json_data)  # returns Patient instance
        except Exception as e:
            logger.error("Patient creation failed: %s", str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        now = datetime.now(timezone.utc)
        patient.created_date = now
        patient.updated_date = now

        db.session.add(patient)
        db.session.commit()

        logger.info("Patient created successfully: MRN=%s", patient.mrn)
        return patient_schema.dump(patient), 201



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
    def put(self, id):
        """Update a patient"""
        logger.info("Updating patient with ID: %d", id)
        patient = Patient.query.get_or_404(id)
        json_data = request.get_json()

        if not json_data:
            return {'message': 'No input data provided'}, 400

        try:
            update_data = patient_schema.load(json_data, partial=True)
        except Exception as e:
            logger.error("Patient update failed for ID %d: %s", id, str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        # update only fields provided
        update_patient_from_data(patient, update_data)

        db.session.commit()
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
