import logging
from flask_restx import Namespace, Resource, fields
from flask import request
from datetime import datetime, timezone
from app.extensions.database import db
from app.models.procedure import Procedures, PatientProcedures, Status, Urgency
from app.schemas.procedure_schema import PatientProcedureSchema, ProcedureSchema
import json
import os

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

procedure_ns = Namespace('procedures', description='Operations for the procedure catalog')
patient_procedure_ns = Namespace('patient_procedures', description='Patient procedure records')

procedure_model = procedure_ns.model('Procedure', {
    'id': fields.Integer(readonly=True),
    'procedure_name': fields.String(required=True),
    'procedure_code': fields.String(required=True),
    'specialised_checklist': fields.Raw(required=False),
})

procedure_schema = ProcedureSchema()
procedures_schema = ProcedureSchema(many=True)

patient_procedure_model = patient_procedure_ns.model('PatientProcedures', {
    'patient_id': fields.Integer(required=True),
    'procedure_id': fields.Integer(required=True),
    'physician': fields.String(required=True),
    'status': fields.String(required=True, enum=['scheduled', 'ready', 'completed', 'cancelled']),
    'urgency': fields.String(required=True, enum=['routine', 'urgent', 'emergent'])
})

patient_procedure_schema = PatientProcedureSchema()
patient_procedures_schema = PatientProcedureSchema(many=True)


@procedure_ns.route('')
class ProcedureList(Resource):
    @procedure_ns.doc('list_procedures', description='Retrieve all procedures in the catalog')
    def get(self):
        """List all procedures"""
        logger.info("Fetching all procedures")
        procedures = Procedures.query.all()
        return procedures_schema.dump(procedures), 200


@procedure_ns.route('/<int:id>')
@procedure_ns.response(404, 'Procedure not found')
class ProcedureResource(Resource):
    @procedure_ns.doc('get_procedure', description='Retrieve a procedure from the catalog by its ID')
    def get(self, id):
        """Get a procedure by ID"""
        logger.info("Fetching procedure with ID: %d", id)
        procedure = Procedures.query.get_or_404(id)
        return procedure_schema.dump(procedure), 200


@patient_procedure_ns.route('')
class PatientProcedureList(Resource):
    @patient_procedure_ns.doc('list_patient_procedures', description='Retrieve all patient procedures')
    @patient_procedure_ns.marshal_list_with(patient_procedure_model)
    def get(self):
        """List all patient procedures"""
        logger.info("Fetching all patient procedures")
        patient_procedures = PatientProcedures.query.all()
        return patient_procedures_schema.dump(patient_procedures), 200

    @patient_procedure_ns.doc('create_patient_procedure', description='Create a new patient procedure')
    @patient_procedure_ns.expect(patient_procedure_model)
    def post(self):
        """Create a new patient procedure"""
        json_data = request.get_json()
        logger.info("Attempting to create a new patient procedure")

        if not json_data:
            logger.warning("No input data provided for patient procedure creation")
            return {'message': 'No input data provided'}, 400

        try:
            validated_data = patient_procedure_schema.load(json_data)
        except Exception as e:
            logger.error("Patient procedure creation failed: %s", str(e))
            return {'message': 'Validation FAILED', 'errors': str(e)}, 422

        try:
            procedure = patient_procedure_schema.load(json_data)
            now = datetime.now(timezone.utc)
            procedure.created_date = now
            procedure.updated_date = now

            db.session.add(procedure)
            db.session.commit()

            logger.info("Patient procedure created successfully: ID %d", procedure.id)
            return patient_procedure_schema.dump(procedure), 201

        except Exception as e:
            logger.error("Database error during patient procedure creation: %s", str(e))
            db.session.rollback()
            return {'message': 'Database error', 'errors': str(e)}, 500


@patient_procedure_ns.route('/<int:id>')
@patient_procedure_ns.response(404, 'Patient procedure not found')
class PatientProcedureResource(Resource):
    @patient_procedure_ns.doc('get_patient_procedure', description='Retrieve a patient procedure by its ID')
    @patient_procedure_ns.marshal_with(patient_procedure_model)
    def get(self, id):
        """Get a patient procedure by ID"""
        logger.info("Fetching patient procedure with ID: %d", id)
        procedure = PatientProcedures.query.get_or_404(id)
        return patient_procedure_schema.dump(procedure), 200

    @patient_procedure_ns.doc('update_patient_procedure', description='Update a patient procedure by its ID')
    @patient_procedure_ns.expect(patient_procedure_model)
    def put(self, id):
        """Update a patient procedure"""
        logger.info("Updating patient procedure with ID: %d", id)
        procedure = PatientProcedures.query.get_or_404(id)
        json_data = request.get_json()

        if not json_data:
            logger.warning("No input data provided for patient procedure update: ID %d", id)
            return {'message': 'No input data provided'}, 400

        try:
            data = patient_procedure_schema.load(json_data, partial=True)
        except Exception as e:
            logger.error("Patient procedure update failed for ID %d: %s", id, str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        for key, value in data.__dict__.items():
            if key != '_sa_instance_state':
                setattr(procedure, key, value)

        procedure.updated_date = datetime.now(timezone.utc)
        db.session.commit()
        logger.info("Patient procedure updated successfully: ID %d", id)
        return patient_procedure_schema.dump(procedure), 200

    @patient_procedure_ns.doc('delete_patient_procedure', description='Delete a patient procedure by its ID')
    def delete(self, id):
        """Delete a patient procedure"""
        logger.info("Deleting patient procedure with ID: %d", id)
        procedure = PatientProcedures.query.get_or_404(id)
        db.session.delete(procedure)
        db.session.commit()
        logger.info("Patient procedure deleted: ID %d", id)
        return '', 204


@patient_procedure_ns.route('/patient/<int:id>')
@patient_procedure_ns.response(404, 'Patient procedures not found')
class PatientAllProceduresResource(Resource):
    @patient_procedure_ns.doc('list_procedures_for_patient', description='Retrieve all patient procedures associated with a specific patient ID')
    @patient_procedure_ns.marshal_list_with(patient_procedure_model)
    def get(self, id):
        """Get all patient procedures for a patient ID"""
        logger.info("Fetching all procedures for patient ID: %d", id)
        procedures = PatientProcedures.query.filter_by(patient_id=id).all()

        if not procedures:
            logger.warning("No procedures found for patient ID: %d", id)
            return {'message': 'No procedures found for this patient'}, 404

        return patient_procedures_schema.dump(procedures), 200
