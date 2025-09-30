from flask_restx import Namespace, Resource, fields
from flask import request
from datetime import datetime
from app.config import db
from app.models.procedure import Procedures, PatientProcedures, Status, Urgency

procedure_ns = Namespace('procedures', description='Procedure catalog operations')

procedure_model = procedure_ns.model('Procedure', {
    'id': fields.Integer(readonly=True),
    'procedure_name': fields.String(required=True),
    'procedure_code': fields.String(required=True),
    'specialised_checklist': fields.Raw(required=False),
})

@procedure_ns.route('/')
class ProcedureList(Resource):
    @procedure_ns.marshal_list_with(procedure_model)
    def get(self):
        """List all procedures"""
        return Procedures.query.all()

    @procedure_ns.expect(procedure_model)
    @procedure_ns.marshal_with(procedure_model, code=201)
    def post(self):
        """Create a new procedure"""
        data = request.json
        procedure = Procedures(
            procedure_name=data['procedure_name'],
            procedure_code=data['procedure_code'],
            specialised_checklist=data.get('specialised_checklist')
        )
        db.session.add(procedure)
        db.session.commit()
        return procedure, 201

@procedure_ns.route('/<int:id>')
@procedure_ns.response(404, 'Procedure not found')
class ProcedureResource(Resource):
    @procedure_ns.marshal_with(procedure_model)
    def get(self, id):
        """Get a procedure by ID"""
        return Procedures.query.get_or_404(id)

    @procedure_ns.expect(procedure_model)
    @procedure_ns.marshal_with(procedure_model)
    def put(self, id):
        """Update a procedure"""
        procedure = Procedures.query.get_or_404(id)
        data = request.json
        procedure.procedure_name = data['procedure_name']
        procedure.procedure_code = data['procedure_code']
        procedure.specialised_checklist = data.get('specialised_checklist')
        db.session.commit()
        return procedure

    @procedure_ns.response(204, 'Deleted')
    def delete(self, id):
        """Delete a procedure"""
        procedure = Procedures.query.get_or_404(id)
        db.session.delete(procedure)
        db.session.commit()
        return '', 204

patient_procedure_ns = Namespace('patient_procedures', description='Patient procedure records')

patient_procedure_model = patient_procedure_ns.model('PatientProcedure', {
    'id': fields.Integer(readonly=True),
    'patient_id': fields.Integer(required=True),
    'procedure_name': fields.String(required=True),
    'procedure_code': fields.String(required=True),
    'scheduled_date': fields.DateTime(required=False),
    'physician': fields.String(required=True),
    'status': fields.String(enum=[s.name for s in Status]),
    'urgency': fields.String(enum=[u.name for u in Urgency]),
    'prep_requirements': fields.Raw(required=False),  # JSON field
    'created_date': fields.DateTime(required=False),
    'updated_date': fields.DateTime(required=False),
})

@patient_procedure_ns.route('/')
class PatientProcedureList(Resource):
    @patient_procedure_ns.marshal_list_with(patient_procedure_model)
    def get(self):
        """List all patient procedures"""
        return PatientProcedures.query.all()

    @patient_procedure_ns.expect(patient_procedure_model)
    @patient_procedure_ns.marshal_with(patient_procedure_model, code=201)
    def post(self):
        """Create a new patient procedure"""
        data = request.json
        now = datetime.utcnow()
        procedure = PatientProcedures(
            patient_id=data['patient_id'],
            procedure_name=data['procedure_name'],
            procedure_code=data['procedure_code'],
            physician=data['physician'],
            status=Status[data['status']],
            urgency=Urgency[data['urgency']],
            prep_requirements=data.get('prep_requirements'),
            created_date=data.get('created_date', now),
        )
        procedure.updated_date = now
        db.session.add(procedure)
        db.session.commit()
        return procedure, 201

@patient_procedure_ns.route('/<int:id>')
@patient_procedure_ns.response(404, 'Patient procedure not found')
class PatientProcedureResource(Resource):
    @patient_procedure_ns.marshal_with(patient_procedure_model)
    def get(self, id):
        """Get a patient procedure by ID"""
        return PatientProcedures.query.get_or_404(id)

    @patient_procedure_ns.expect(patient_procedure_model)
    @patient_procedure_ns.marshal_with(patient_procedure_model)
    def put(self, id):
        """Update a patient procedure"""
        procedure = PatientProcedures.query.get_or_404(id)
        data = request.json
        procedure.patient_id = data['patient_id']
        procedure.procedure_name = data['procedure_name']
        procedure.procedure_code = data['procedure_code']
        procedure.physician = data['physician']
        procedure.status = Status[data['status']]
        procedure.urgency = Urgency[data['urgency']]
        procedure.prep_requirements = data.get('prep_requirements')
        procedure.scheduled_date = data.get('scheduled_date')
        procedure.updated_date = datetime.utcnow()
        db.session.commit()
        return procedure

    @patient_procedure_ns.response(204, 'Deleted')
    def delete(self, id):
        """Delete a patient procedure"""
        procedure = PatientProcedures.query.get_or_404(id)
        db.session.delete(procedure)
        db.session.commit()
        return '', 204