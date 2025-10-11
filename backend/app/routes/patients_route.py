import logging
from flask_restx import Namespace, Resource, fields
from flask import request
from datetime import datetime, timezone
from app.config import db
from app.models.patient import Patient
from app.schemas.patient_schema import PatientSchema

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

patient_ns = Namespace('patients', description='Patient records')

patient_schema = PatientSchema()
patients_schema = PatientSchema(many=True)

patient_model = patient_ns.model('Patient', {
    'id': fields.Integer(readonly=True),
    'mrn': fields.String(required=True),
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'age': fields.Integer(required=True),
    'gender': fields.String(required=True),
    'phone': fields.String(),
    'insurance': fields.Boolean(),

    'allergies': fields.String(),
    'medications': fields.String(),
    'medical_history': fields.Raw(),

    'blood_pressure_systolic': fields.String(),
    'blood_pressure_diastolic': fields.String(),
    'heart_rate': fields.Integer(),
    'temperature': fields.Float(),
    'respiratory_rate': fields.Integer(),
    'oxygen_saturation': fields.Float(),
    'weight_kg': fields.Float(),
    'height_cm': fields.Float(),

    'hemoglobin': fields.Float(),
    'hematocrit': fields.Float(),
    'platelet_count': fields.Float(),
    'white_blood_cell_count': fields.Float(),
    'creatinine': fields.Float(),
    'bun': fields.Float(),
    'glucose': fields.Float(),
    'inr': fields.Float(),
    'pt': fields.Float(),
    'ptt': fields.Float(),

    'created_date': fields.DateTime(),
    'updated_date': fields.DateTime(),
})

def update_patient_from_data(patient, data):
    for field in data:
        if hasattr(patient, field):
            setattr(patient, field, data[field])
    patient.updated_date = datetime.now(timezone.utc)


@patient_ns.route('/')
class PatientList(Resource):
    def get(self):
        """List all patients"""
        logger.info("Fetching all patient records")
        patients = Patient.query.all()
        return patients_schema.dump(patients), 200

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
    def get(self, id):
        """Get patient by ID"""
        logger.info("Fetching patient with ID: %d", id)
        patient = Patient.query.get_or_404(id)
        return patient_schema.dump(patient), 200

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

    def delete(self, id):
        """Delete a patient"""
        logger.info("Deleting patient with ID: %d", id)
        patient = Patient.query.get_or_404(id)
        db.session.delete(patient)
        db.session.commit()
        logger.info("Patient deleted successfully: ID %d", id)
        return '', 204
