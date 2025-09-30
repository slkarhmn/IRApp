from flask_restx import Namespace, Resource, fields
from flask import request
from app.config import db
from app.models.checklist import ProcedurePlanning, SignIn, SignOut

checklist_ns = Namespace('checklist', description='Checklist operations')

procedure_planning_model = checklist_ns.model('ProcedurePlanning', {
    'id': fields.Integer(readonly=True),
    'procedure_id': fields.Integer(required=True),

    'discussed_with_referring_physician': fields.Boolean(),
    'imaging_studies_reviewed': fields.Boolean(),
    'relevant_medical_history': fields.String(),
    'informed_consent': fields.Boolean(),
    'prophylaxis': fields.Boolean(),
    'tools_requested_and_present': fields.String(),
    'fasting_order': fields.Boolean(),
    'relevant_lab_tests': fields.String(),
    'anaesthetist_necessary': fields.Boolean(),
    'anticoagulant_stopped': fields.Boolean(),
    'post_precedural_bed_required': fields.Boolean(),
    'contrast_allergy_prophylaxis_necessary': fields.Boolean(),
})

@checklist_ns.route('/procedure-planning/')
class ProcedurePlanningList(Resource):
    @checklist_ns.marshal_list_with(procedure_planning_model)
    def get(self):
        """List all procedure planning entries"""
        return ProcedurePlanning.query.all()

    @checklist_ns.expect(procedure_planning_model)
    @checklist_ns.marshal_with(procedure_planning_model, code=201)
    def post(self):
        """Create a new procedure planning entry"""
        data = request.json
        entry = ProcedurePlanning(**data)
        db.session.add(entry)
        db.session.commit()
        return entry, 201

@checklist_ns.route('/procedure-planning/<int:id>')
@checklist_ns.response(404, 'ProcedurePlanning not found')
class ProcedurePlanningResource(Resource):
    @checklist_ns.marshal_with(procedure_planning_model)
    def get(self, id):
        return ProcedurePlanning.query.get_or_404(id)

    @checklist_ns.expect(procedure_planning_model)
    @checklist_ns.marshal_with(procedure_planning_model)
    def put(self, id):
        entry = ProcedurePlanning.query.get_or_404(id)
        data = request.json
        for key, value in data.items():
            setattr(entry, key, value)
        db.session.commit()
        return entry

    @checklist_ns.response(204, 'Deleted')
    def delete(self, id):
        entry = ProcedurePlanning.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        return '', 204


sign_in_model = checklist_ns.model('SignIn', {
    'id': fields.Integer(readonly=True),
    'procedure_id': fields.Integer(required=True),

    'team_members_introduced': fields.String(),
    'records_given_to_patient': fields.String(),
    'correct_patient': fields.Boolean(),
    'correct_side': fields.Boolean(),
    'correct_site': fields.Boolean(),
    'patient_fasting_order_followed': fields.Boolean(),
    'iv_access_necessary': fields.Boolean(),
    'monitoring_equipment_attached': fields.Boolean(),
    'checked_lab_tests': fields.String(),
    'allergies_checked': fields.Boolean(),
    'prophylaxis_checked': fields.Boolean(),
    'drugs_administered': fields.String(),
    'complications_discussed': fields.String(),
    'consent_obtained': fields.Boolean(),
})

@checklist_ns.route('/sign-in')
class SignInList(Resource):
    @checklist_ns.marshal_list_with(sign_in_model)
    def get(self):
        return SignIn.query.all()

    @checklist_ns.expect(sign_in_model)
    @checklist_ns.marshal_with(sign_in_model, code=201)
    def post(self):
        data = request.json
        entry = SignIn(**data)
        db.session.add(entry)
        db.session.commit()
        return entry, 201

@checklist_ns.route('/sign-in/<int:id>')
@checklist_ns.response(404, 'SignIn not found')
class SignInResource(Resource):
    @checklist_ns.marshal_with(sign_in_model)
    def get(self, id):
        return SignIn.query.get_or_404(id)

    @checklist_ns.expect(sign_in_model)
    @checklist_ns.marshal_with(sign_in_model)
    def put(self, id):
        entry = SignIn.query.get_or_404(id)
        data = request.json
        for key, value in data.items():
            setattr(entry, key, value)
        db.session.commit()
        return entry

    @checklist_ns.response(204, 'Deleted')
    def delete(self, id):
        entry = SignIn.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        return '', 204

sign_out_model = checklist_ns.model('SignOut', {
    'id': fields.Integer(readonly=True),
    'procedure_id': fields.Integer(required=True),

    'post_op_note': fields.String(),
    'vital_signs_normal': fields.Boolean(),
    'medications_recorded': fields.String(),
    'contrast_media_recorded': fields.String(),
    'lab_tests_requested': fields.Boolean(),
    'samples_labelled': fields.Boolean(),
    'samples_sent_to_lab': fields.Boolean(),
    'procedure_results_discussed_with_patients': fields.String(),
    'post_discharge_instructions_given_to_patient': fields.String(),
    'follow_up_appt_made': fields.Boolean(),
    'follow_up_appt_date': fields.DateTime(),
    'procedure_results_communicated_to_referring_physician': fields.Boolean(),
})

@checklist_ns.route('/sign-out/')
class SignOutList(Resource):
    @checklist_ns.marshal_list_with(sign_out_model)
    def get(self):
        return SignOut.query.all()

    @checklist_ns.expect(sign_out_model)
    @checklist_ns.marshal_with(sign_out_model, code=201)
    def post(self):
        data = request.json
        entry = SignOut(**data)
        db.session.add(entry)
        db.session.commit()
        return entry, 201

@checklist_ns.route('/sign-out/<int:id>')
@checklist_ns.response(404, 'SignOut not found')
class SignOutResource(Resource):
    @checklist_ns.marshal_with(sign_out_model)
    def get(self, id):
        return SignOut.query.get_or_404(id)

    @checklist_ns.expect(sign_out_model)
    @checklist_ns.marshal_with(sign_out_model)
    def put(self, id):
        entry = SignOut.query.get_or_404(id)
        data = request.json
        for key, value in data.items():
            setattr(entry, key, value)
        db.session.commit()
        return entry

    @checklist_ns.response(204, 'Deleted')
    def delete(self, id):
        entry = SignOut.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        return '', 204
