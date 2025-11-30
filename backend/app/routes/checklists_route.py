import logging
from flask_restx import Namespace, Resource, fields
from flask import request
from marshmallow import ValidationError
from app.extensions.database import db
from app.models.checklist import ProcedurePlanning, SignIn, SignOut
from app.schemas.checklist_schema import ProcedurePlanningSchema, SignInSchema, SignOutSchema

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

checklist_ns = Namespace('checklist', description='Checklist operations')

procedure_planning_schema = ProcedurePlanningSchema()
procedure_planning_list_schema = ProcedurePlanningSchema(many=True)

sign_in_schema = SignInSchema()
sign_in_list_schema = SignInSchema(many=True)

sign_out_schema = SignOutSchema()
sign_out_list_schema = SignOutSchema(many=True)

procedure_planning_model = checklist_ns.model('ProcedurePlanning', {
    'id': fields.Integer(readonly=True, description='Procedure planning unique identifier'),
    'patient_procedure_id': fields.Integer(required=True, description='Foreign key to patient procedure'),
    'discussed_with_referring_physician': fields.Boolean(description='Was case discussed with referring physician?'),
    'imaging_studies_reviewed': fields.Boolean(description='Were imaging studies reviewed?'),
    'relevant_medical_history': fields.String(description='Relevant medical history notes'),
    'informed_consent': fields.Boolean(description='Was informed consent obtained?'),
    'prophylaxis': fields.Boolean(description='Was prophylaxis given?'),
    'tools_requested_and_present': fields.String(description='List of tools requested and present'),
    'fasting_order': fields.Boolean(description='Was fasting order given?'),
    'relevant_lab_tests': fields.String(description='Relevant lab test results'),
    'anaesthetist_necessary': fields.Boolean(description='Is anaesthetist necessary?'),
    'anticoagulant_stopped': fields.Boolean(description='Were anticoagulants stopped?'),
    'post_precedural_bed_required': fields.Boolean(description='Is post-procedural bed required?'),
    'contrast_allergy_prophylaxis_necessary': fields.Boolean(description='Is contrast allergy prophylaxis necessary?')
})

sign_in_model = checklist_ns.model('SignIn', {
    'id': fields.Integer(readonly=True, description='Sign-in unique identifier'),
    'patient_procedure_id': fields.Integer(required=True, description='Foreign key to patient procedure'),
    'team_members_introduced': fields.String(description='List of team members introduced'),
    'records_given_to_patient': fields.String(description='Records given to patient'),
    'correct_patient': fields.Boolean(description='Correct patient verified?'),
    'correct_side': fields.Boolean(description='Correct side verified?'),
    'correct_site': fields.Boolean(description='Correct site verified?'),
    'patient_fasting_order_followed': fields.Boolean(description='Was fasting order followed?'),
    'iv_access_necessary': fields.Boolean(description='Is IV access necessary?'),
    'monitoring_equipment_attached': fields.Boolean(description='Is monitoring equipment attached?'),
    'checked_lab_tests': fields.String(description='Lab tests checked'),
    'allergies_checked': fields.Boolean(description='Were allergies checked?'),
    'prophylaxis_checked': fields.Boolean(description='Was prophylaxis checked?'),
    'drugs_administered': fields.String(description='Drugs administered'),
    'complications_discussed': fields.String(description='Complications discussed with patient'),
    'consent_obtained': fields.Boolean(description='Was consent obtained?')
})

sign_out_model = checklist_ns.model('SignOut', {
    'id': fields.Integer(readonly=True, description='Sign-out unique identifier'),
    'patient_procedure_id': fields.Integer(required=True, description='Foreign key to patient procedure'),
    'post_op_note': fields.String(description='Post-operative note'),
    'vital_signs_normal': fields.Boolean(description='Are vital signs normal?'),
    'medications_recorded': fields.String(description='Medications recorded'),
    'contrast_media_recorded': fields.String(description='Contrast media recorded'),
    'lab_tests_requested': fields.Boolean(description='Were lab tests requested?'),
    'samples_labelled': fields.Boolean(description='Were samples labelled?'),
    'samples_sent_to_lab': fields.Boolean(description='Were samples sent to lab?'),
    'procedure_results_discussed_with_patients': fields.String(description='Procedure results discussed with patient'),
    'post_discharge_instructions_given_to_patient': fields.String(description='Post-discharge instructions given'),
    'follow_up_appt_made': fields.Boolean(description='Was follow-up appointment made?'),
    'follow_up_appt_date': fields.DateTime(description='Follow-up appointment date'),
    'procedure_results_communicated_to_referring_physician': fields.Boolean(description='Were results communicated to referring physician?')
})

complete_checklist_model = checklist_ns.model('CompleteChecklist', {
    'procedure_planning': fields.Nested(procedure_planning_model, allow_null=True),
    'sign_in': fields.Nested(sign_in_model, allow_null=True),
    'sign_out': fields.Nested(sign_out_model, allow_null=True)
})

@checklist_ns.route('/procedure-planning')
class ProcedurePlanningList(Resource):
    @checklist_ns.doc('list_procedure_planning', description='Retrieve all procedure planning entries')
    @checklist_ns.marshal_list_with(procedure_planning_model)
    def get(self):
        entries = ProcedurePlanning.query.all()
        return procedure_planning_list_schema.dump(entries), 200

    @checklist_ns.doc('create_procedure_planning', description='Create a new procedure planning entry')
    @checklist_ns.expect(procedure_planning_model)
    @checklist_ns.marshal_with(procedure_planning_model, code=201)
    def post(self):
        json_data = request.get_json()
        try:
            entry = procedure_planning_schema.load(json_data)
        except ValidationError as err:
            return {"errors": err.messages}, 400
        db.session.add(entry)
        db.session.commit()
        return procedure_planning_schema.dump(entry), 201


@checklist_ns.route('/procedure-planning/by-procedure/<int:patient_procedure_id>')
class ProcedurePlanningByProcedure(Resource):
    @checklist_ns.doc('get_procedure_planning_by_procedure', description='Retrieve a procedure planning entry by patient procedure ID')
    @checklist_ns.marshal_with(procedure_planning_model)
    def get(self, patient_procedure_id):
        entry = ProcedurePlanning.query.filter_by(patient_procedure_id=patient_procedure_id).first_or_404()
        return procedure_planning_schema.dump(entry), 200


@checklist_ns.route('/procedure-planning/<int:id>')
class ProcedurePlanningResource(Resource):
    @checklist_ns.marshal_with(procedure_planning_model)
    def get(self, id):
        entry = ProcedurePlanning.query.get_or_404(id)
        return procedure_planning_schema.dump(entry), 200

    @checklist_ns.expect(procedure_planning_model)
    @checklist_ns.marshal_with(procedure_planning_model)
    def put(self, id):
        entry = ProcedurePlanning.query.get_or_404(id)
        json_data = request.get_json()
        updated_entry = procedure_planning_schema.load(json_data, instance=entry, partial=True)
        db.session.commit()
        return procedure_planning_schema.dump(updated_entry), 200

    def delete(self, id):
        entry = ProcedurePlanning.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        return '', 204


@checklist_ns.route('/sign-in')
class SignInList(Resource):
    @checklist_ns.marshal_list_with(sign_in_model)
    def get(self):
        entries = SignIn.query.all()
        return sign_in_list_schema.dump(entries), 200

    @checklist_ns.expect(sign_in_model)
    @checklist_ns.marshal_with(sign_in_model, code=201)
    def post(self):
        json_data = request.get_json()
        entry = sign_in_schema.load(json_data)
        db.session.add(entry)
        db.session.commit()
        return sign_in_schema.dump(entry), 201


@checklist_ns.route('/sign-in/by-procedure/<int:patient_procedure_id>')
class SignInByProcedure(Resource):
    @checklist_ns.marshal_with(sign_in_model)
    def get(self, patient_procedure_id):
        entry = SignIn.query.filter_by(patient_procedure_id=patient_procedure_id).first_or_404()
        return sign_in_schema.dump(entry), 200


@checklist_ns.route('/sign-in/<int:id>')
class SignInResource(Resource):
    @checklist_ns.marshal_with(sign_in_model)
    def get(self, id):
        entry = SignIn.query.get_or_404(id)
        return sign_in_schema.dump(entry), 200

    @checklist_ns.expect(sign_in_model)
    @checklist_ns.marshal_with(sign_in_model)
    def put(self, id):
        entry = SignIn.query.get_or_404(id)
        json_data = request.get_json()
        updated_entry = sign_in_schema.load(json_data, instance=entry, partial=True)
        db.session.commit()
        return sign_in_schema.dump(updated_entry), 200

    def delete(self, id):
        entry = SignIn.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        return '', 204


@checklist_ns.route('/sign-out')
class SignOutList(Resource):
    @checklist_ns.marshal_list_with(sign_out_model)
    def get(self):
        entries = SignOut.query.all()
        return sign_out_list_schema.dump(entries), 200

    @checklist_ns.expect(sign_out_model)
    @checklist_ns.marshal_with(sign_out_model, code=201)
    def post(self):
        json_data = request.get_json()
        entry = sign_out_schema.load(json_data)
        db.session.add(entry)
        db.session.commit()
        return sign_out_schema.dump(entry), 201


@checklist_ns.route('/sign-out/by-procedure/<int:patient_procedure_id>')
class SignOutByProcedure(Resource):
    @checklist_ns.marshal_with(sign_out_model)
    def get(self, patient_procedure_id):
        entry = SignOut.query.filter_by(patient_procedure_id=patient_procedure_id).first_or_404()
        return sign_out_schema.dump(entry), 200


@checklist_ns.route('/sign-out/<int:id>')
class SignOutResource(Resource):
    @checklist_ns.marshal_with(sign_out_model)
    def get(self, id):
        entry = SignOut.query.get_or_404(id)
        return sign_out_schema.dump(entry), 200

    @checklist_ns.expect(sign_out_model)
    @checklist_ns.marshal_with(sign_out_model)
    def put(self, id):
        entry = SignOut.query.get_or_404(id)
        json_data = request.get_json()
        updated_entry = sign_out_schema.load(json_data, instance=entry, partial=True)
        db.session.commit()
        return sign_out_schema.dump(updated_entry), 200

    def delete(self, id):
        entry = SignOut.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        return '', 204


@checklist_ns.route('/complete-checklist/<int:procedure_planning_id>')
class CompleteChecklistByProcedurePlanning(Resource):
    @checklist_ns.marshal_with(complete_checklist_model)
    def get(self, procedure_planning_id):
        procedure_planning = ProcedurePlanning.query.get_or_404(procedure_planning_id)
        patient_procedure_id = procedure_planning.patient_procedure_id

        sign_in = SignIn.query.filter_by(patient_procedure_id=patient_procedure_id).first()
        sign_out = SignOut.query.filter_by(patient_procedure_id=patient_procedure_id).first()

        return {
            'procedure_planning': procedure_planning_schema.dump(procedure_planning),
            'sign_in': sign_in_schema.dump(sign_in) if sign_in else None,
            'sign_out': sign_out_schema.dump(sign_out) if sign_out else None
        }, 200
