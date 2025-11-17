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
    'procedure_id': fields.Integer(required=True, description='Foreign key to patient procedure'),
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
    'procedure_id': fields.Integer(required=True, description='Foreign key to patient procedure'),
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
    'procedure_id': fields.Integer(required=True, description='Foreign key to patient procedure'),
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


@checklist_ns.route('/procedure-planning')
class ProcedurePlanningList(Resource):
    @checklist_ns.doc('list_procedure_planning', description='Retrieve all procedure planning entries')
    @checklist_ns.marshal_list_with(procedure_planning_model)
    def get(self):
        """List all procedure planning entries"""
        logger.info("Fetching all procedure planning entries")
        entries = ProcedurePlanning.query.all()
        return procedure_planning_list_schema.dump(entries), 200

    @checklist_ns.doc('create_procedure_planning', description='Create a new procedure planning entry')
    @checklist_ns.expect(procedure_planning_model)
    @checklist_ns.marshal_with(procedure_planning_model, code=201)
    def post(self):
        """Create a new procedure planning entry"""
        json_data = request.get_json()
        logger.info("Creating a new procedure planning entry")
        try:
            entry = procedure_planning_schema.load(json_data)
        except ValidationError as err:
            logger.error("Procedure planning validation error: %s", err.messages)
            return {"errors": err.messages}, 400

        db.session.add(entry)
        db.session.commit()
        logger.info("Procedure planning entry created: ID=%s", entry.id)
        return procedure_planning_schema.dump(entry), 201


@checklist_ns.route('/procedure-planning/<int:id>')
@checklist_ns.response(404, 'ProcedurePlanning not found')
@checklist_ns.param('id', 'The procedure planning identifier')
class ProcedurePlanningResource(Resource):
    @checklist_ns.doc('get_procedure_planning', description='Retrieve a procedure planning entry by its ID')
    @checklist_ns.marshal_with(procedure_planning_model)
    def get(self, id):
        """Fetch a procedure planning entry by ID"""
        logger.info("Fetching procedure planning entry with ID: %d", id)
        entry = ProcedurePlanning.query.get_or_404(id)
        return procedure_planning_schema.dump(entry), 200

    @checklist_ns.doc('update_procedure_planning', description='Update a procedure planning entry by its ID')
    @checklist_ns.expect(procedure_planning_model)
    @checklist_ns.marshal_with(procedure_planning_model)
    def put(self, id):
        """Update a procedure planning entry"""
        logger.info("Updating procedure planning entry with ID: %d", id)
        entry = ProcedurePlanning.query.get_or_404(id)
        json_data = request.get_json()
        try:
            updated_entry = procedure_planning_schema.load(json_data, instance=entry, partial=True)
        except ValidationError as err:
            logger.error("Procedure planning update failed: %s", err.messages)
            return {"errors": err.messages}, 400

        db.session.commit()
        logger.info("Procedure planning entry updated: ID=%d", id)
        return procedure_planning_schema.dump(updated_entry), 200

    @checklist_ns.doc('delete_procedure_planning', description='Delete a procedure planning entry by its ID')
    @checklist_ns.response(204, 'ProcedurePlanning deleted')
    def delete(self, id):
        """Delete a procedure planning entry"""
        logger.info("Deleting procedure planning entry with ID: %d", id)
        entry = ProcedurePlanning.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        logger.info("Procedure planning entry deleted: ID=%d", id)
        return '', 204


@checklist_ns.route('/sign-in')
class SignInList(Resource):
    @checklist_ns.doc('list_sign_in', description='Retrieve all sign-in entries')
    @checklist_ns.marshal_list_with(sign_in_model)
    def get(self):
        """List all sign-in entries"""
        logger.info("Fetching all sign-in entries")
        entries = SignIn.query.all()
        return sign_in_list_schema.dump(entries), 200

    @checklist_ns.doc('create_sign_in', description='Create a new sign-in entry')
    @checklist_ns.expect(sign_in_model)
    @checklist_ns.marshal_with(sign_in_model, code=201)
    def post(self):
        """Create a new sign-in entry"""
        json_data = request.get_json()
        logger.info("Creating a new sign-in entry")
        try:
            entry = sign_in_schema.load(json_data)
        except ValidationError as err:
            logger.error("Sign-in validation error: %s", err.messages)
            return {"errors": err.messages}, 400

        db.session.add(entry)
        db.session.commit()
        logger.info("Sign-in entry created: ID=%s", entry.id)
        return sign_in_schema.dump(entry), 201


@checklist_ns.route('/sign-in/<int:id>')
@checklist_ns.response(404, 'SignIn not found')
@checklist_ns.param('id', 'The sign-in identifier')
class SignInResource(Resource):
    @checklist_ns.doc('get_sign_in', description='Retrieve a sign-in entry by its ID')
    @checklist_ns.marshal_with(sign_in_model)
    def get(self, id):
        """Fetch a sign-in entry by ID"""
        logger.info("Fetching sign-in entry with ID: %d", id)
        entry = SignIn.query.get_or_404(id)
        return sign_in_schema.dump(entry), 200

    @checklist_ns.doc('update_sign_in', description='Update a sign-in entry by its ID')
    @checklist_ns.expect(sign_in_model)
    @checklist_ns.marshal_with(sign_in_model)
    def put(self, id):
        """Update a sign-in entry"""
        logger.info("Updating sign-in entry with ID: %d", id)
        entry = SignIn.query.get_or_404(id)
        json_data = request.get_json()
        try:
            updated_entry = sign_in_schema.load(json_data, instance=entry, partial=True)
        except ValidationError as err:
            logger.error("Sign-in update failed: %s", err.messages)
            return {"errors": err.messages}, 400

        db.session.commit()
        logger.info("Sign-in entry updated: ID=%d", id)
        return sign_in_schema.dump(updated_entry), 200

    @checklist_ns.doc('delete_sign_in', description='Delete a sign-in entry by its ID')
    @checklist_ns.response(204, 'SignIn deleted')
    def delete(self, id):
        """Delete a sign-in entry"""
        logger.info("Deleting sign-in entry with ID: %d", id)
        entry = SignIn.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        logger.info("Sign-in entry deleted: ID=%d", id)
        return '', 204


@checklist_ns.route('/sign-out')
class SignOutList(Resource):
    @checklist_ns.doc('list_sign_out', description='Retrieve all sign-out entries')
    @checklist_ns.marshal_list_with(sign_out_model)
    def get(self):
        """List all sign-out entries"""
        logger.info("Fetching all sign-out entries")
        entries = SignOut.query.all()
        return sign_out_list_schema.dump(entries), 200

    @checklist_ns.doc('create_sign_out', description='Create a new sign-out entry')
    @checklist_ns.expect(sign_out_model)
    @checklist_ns.marshal_with(sign_out_model, code=201)
    def post(self):
        """Create a new sign-out entry"""
        json_data = request.get_json()
        logger.info("Creating a new sign-out entry")
        try:
            entry = sign_out_schema.load(json_data)
        except ValidationError as err:
            logger.error("Sign-out validation error: %s", err.messages)
            return {"errors": err.messages}, 400

        db.session.add(entry)
        db.session.commit()
        logger.info("Sign-out entry created: ID=%s", entry.id)
        return sign_out_schema.dump(entry), 201


@checklist_ns.route('/sign-out/<int:id>')
@checklist_ns.response(404, 'SignOut not found')
@checklist_ns.param('id', 'The sign-out identifier')
class SignOutResource(Resource):
    @checklist_ns.doc('get_sign_out', description='Retrieve a sign-out entry by its ID')
    @checklist_ns.marshal_with(sign_out_model)
    def get(self, id):
        """Fetch a sign-out entry by ID"""
        logger.info("Fetching sign-out entry with ID: %d", id)
        entry = SignOut.query.get_or_404(id)
        return sign_out_schema.dump(entry), 200

    @checklist_ns.doc('update_sign_out', description='Update a sign-out entry by its ID')
    @checklist_ns.expect(sign_out_model)
    @checklist_ns.marshal_with(sign_out_model)
    def put(self, id):
        """Update a sign-out entry"""
        logger.info("Updating sign-out entry with ID: %d", id)
        entry = SignOut.query.get_or_404(id)
        json_data = request.get_json()
        try:
            updated_entry = sign_out_schema.load(json_data, instance=entry, partial=True)
        except ValidationError as err:
            logger.error("Sign-out update failed: %s", err.messages)
            return {"errors": err.messages}, 400

        db.session.commit()
        logger.info("Sign-out entry updated: ID=%d", id)
        return sign_out_schema.dump(updated_entry), 200

    @checklist_ns.doc('delete_sign_out', description='Delete a sign-out entry by its ID')
    @checklist_ns.response(204, 'SignOut deleted')
    def delete(self, id):
        """Delete a sign-out entry"""
        logger.info("Deleting sign-out entry with ID: %d", id)
        entry = SignOut.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        logger.info("Sign-out entry deleted: ID=%d", id)
        return '', 204