import logging
from flask_restx import Namespace, Resource, fields
from flask import request
from datetime import datetime, timezone
from app.extensions.database import db
from app.models.procedure import Procedures, PatientProcedures, Status, Urgency
from app.schemas.procedure_schema import PatientProcedureSchema, ProcedureSchema

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

procedure_ns = Namespace('procedures', description='Procedure catalog operations')
patient_procedure_ns = Namespace('patient_procedures', description='Patient procedure records')

procedure_model = procedure_ns.model('Procedure', {
    'id': fields.Integer(readonly=True),
    'procedure_name': fields.String(required=True),
    'procedure_code': fields.String(required=True),
    'specialised_checklist': fields.Raw(required=False),
})

procedure_schema = ProcedureSchema()
procedures_schema = ProcedureSchema(many=True)

patient_procedure_schema = PatientProcedureSchema()
patient_procedures_schema = PatientProcedureSchema(many=True)

@procedure_ns.route('/')
class ProcedureList(Resource):
    def get(self):
        """List all procedures"""
        logger.info("Fetching all procedures")
        procedures = Procedures.query.all()
        return procedures_schema.dump(procedures), 200

    #def post(self):
    #    """Create a new procedure"""
    #    json_data = request.get_json()
    #    logger.info("Attempting to create a new procedure")

    #   if not json_data:
    #        logger.warning("No input data provided for procedure creation")
    #        return {'message': 'No input data provided'}, 400

    #    try:
    #        procedure = procedure_schema.load(json_data)
    #    except Exception as e:
    #        logger.error("Procedure creation failed: %s", str(e))
    #        return {'message': 'Validation failed', 'errors': str(e)}, 422

    #    db.session.add(procedure)
    #    db.session.commit()
    #    logger.info("Procedure created successfully: %s", procedure.procedure_code)
    #    return procedure_schema.dump(procedure), 201


@procedure_ns.route('/<int:id>')
@procedure_ns.response(404, 'Procedure not found')
class ProcedureResource(Resource):
    def get(self, id):
        """Get a procedure by ID"""
        logger.info("Fetching procedure with ID: %d", id)
        procedure = Procedures.query.get_or_404(id)
        return procedure_schema.dump(procedure), 200

    #def put(self, id):
    #    """Update a procedure"""
    #    logger.info("Updating procedure with ID: %d", id)
    #    procedure = Procedures.query.get_or_404(id)
    #    json_data = request.get_json()

    #    if not json_data:
    #        logger.warning("No input data provided for procedure update: ID %d", id)
    #        return {'message': 'No input data provided'}, 400

    #    try:
    #        data = procedure_schema.load(json_data, partial=True)
    #    except Exception as e:
    #        logger.error("Procedure update failed for ID %d: %s", id, str(e))
    #        return {'message': 'Validation failed', 'errors': str(e)}, 422

    #    for key, value in data.__dict__.items():
    #        if key != '_sa_instance_state':
    #            setattr(procedure, key, value)

    #    db.session.commit()
    #    logger.info("Procedure updated successfully: ID %d", id)
    #    return procedure_schema.dump(procedure), 200

    #def delete(self, id):
    #    """Delete a procedure"""
    #    logger.info("Deleting procedure with ID: %d", id)
    #    procedure = Procedures.query.get_or_404(id)
    #    db.session.delete(procedure)
    #    db.session.commit()
    #    logger.info("Procedure deleted: ID %d", id)
    #    return '', 204


@patient_procedure_ns.route('/')
class PatientProcedureList(Resource):
    def get(self):
        """List all patient procedures"""
        logger.info("Fetching all patient procedures")
        patient_procedures = PatientProcedures.query.all()
        return patient_procedures_schema.dump(patient_procedures), 200

    def post(self):
        """Create a new patient procedure"""
        json_data = request.get_json()
        logger.info("Attempting to create a new patient procedure")

        if not json_data:
            logger.warning("No input data provided for patient procedure creation")
            return {'message': 'No input data provided'}, 400

        try:
            procedure = patient_procedure_schema.load(json_data)
        except Exception as e:
            logger.error("Patient procedure creation failed: %s", str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        now = datetime.now(timezone.utc)
        if not procedure.created_date:
            procedure.created_date = now
        procedure.updated_date = now

        db.session.add(procedure)
        db.session.commit()
        logger.info("Patient procedure created successfully: ID %d", procedure.id)
        return patient_procedure_schema.dump(procedure), 201


@patient_procedure_ns.route('/<int:id>')
@patient_procedure_ns.response(404, 'Patient procedure not found')
class PatientProcedureResource(Resource):
    def get(self, id):
        """Get a patient procedure by ID"""
        logger.info("Fetching patient procedure with ID: %d", id)
        procedure = PatientProcedures.query.get_or_404(id)
        return patient_procedure_schema.dump(procedure), 200

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

    def delete(self, id):
        """Delete a patient procedure"""
        logger.info("Deleting patient procedure with ID: %d", id)
        procedure = PatientProcedures.query.get_or_404(id)
        db.session.delete(procedure)
        db.session.commit()
        logger.info("Patient procedure deleted: ID %d", id)
        return '', 204
