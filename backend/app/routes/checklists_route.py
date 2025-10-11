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


@checklist_ns.route('/procedure-planning/')
class ProcedurePlanningList(Resource):
    def get(self):
        logger.info("Fetching all procedure planning entries")
        entries = ProcedurePlanning.query.all()
        return procedure_planning_list_schema.dump(entries), 200

    def post(self):
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
class ProcedurePlanningResource(Resource):
    def get(self, id):
        logger.info("Fetching procedure planning entry with ID: %d", id)
        entry = ProcedurePlanning.query.get_or_404(id)
        return procedure_planning_schema.dump(entry), 200

    def put(self, id):
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

    def delete(self, id):
        logger.info("Deleting procedure planning entry with ID: %d", id)
        entry = ProcedurePlanning.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        logger.info("Procedure planning entry deleted: ID=%d", id)
        return '', 204


@checklist_ns.route('/sign-in/')
class SignInList(Resource):
    def get(self):
        logger.info("Fetching all sign-in entries")
        entries = SignIn.query.all()
        return sign_in_list_schema.dump(entries), 200

    def post(self):
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
class SignInResource(Resource):
    def get(self, id):
        logger.info("Fetching sign-in entry with ID: %d", id)
        entry = SignIn.query.get_or_404(id)
        return sign_in_schema.dump(entry), 200

    def put(self, id):
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

    def delete(self, id):
        logger.info("Deleting sign-in entry with ID: %d", id)
        entry = SignIn.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        logger.info("Sign-in entry deleted: ID=%d", id)
        return '', 204


@checklist_ns.route('/sign-out/')
class SignOutList(Resource):
    def get(self):
        logger.info("Fetching all sign-out entries")
        entries = SignOut.query.all()
        return sign_out_list_schema.dump(entries), 200

    def post(self):
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
class SignOutResource(Resource):
    def get(self, id):
        logger.info("Fetching sign-out entry with ID: %d", id)
        entry = SignOut.query.get_or_404(id)
        return sign_out_schema.dump(entry), 200

    def put(self, id):
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

    def delete(self, id):
        logger.info("Deleting sign-out entry with ID: %d", id)
        entry = SignOut.query.get_or_404(id)
        db.session.delete(entry)
        db.session.commit()
        logger.info("Sign-out entry deleted: ID=%d", id)
        return '', 204
