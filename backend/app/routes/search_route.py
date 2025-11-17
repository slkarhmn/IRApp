import logging
from flask import request
from flask_restx import Namespace, Resource, fields

from app.models.users import Users, UserType
from app.models.staff import Staff
from app.models.patient import Patient
from app.extensions.database import db

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

search_ns = Namespace('search', description='Search the tables')

user_model = search_ns.model("User", {
    "id": fields.Integer,
    "first_name": fields.String,
    "last_name": fields.String,
    "email": fields.String,
    "user_type": fields.String,
})

staff_model = search_ns.model("Staff", {
    "id": fields.Integer,
    "first_name": fields.String,
    "last_name": fields.String,
    "specialty_id": fields.Integer
})

patient_model = search_ns.model("Patient", {
    "id": fields.Integer,
    "first_name": fields.String,
    "last_name": fields.String,
    "insurance": fields.Boolean,
    "created_date": fields.DateTime,
    "updated_date": fields.DateTime,
})

@search_ns.route('/users')
class SearchUsers(Resource):

    @search_ns.param("keyword", "Search by first or last name")
    @search_ns.marshal_list_with(user_model)
    def get(self):
        keyword = request.args.get("keyword", "")
        query = Users.query

        if keyword:
            keyword_like = f"%{keyword}%"
            query = query.filter(
                db.or_(
                    Users.first_name.ilike(keyword_like),
                    Users.last_name.ilike(keyword_like),
                )
            )
        return query.all()


@search_ns.route('/staff')
class SearchStaff(Resource):

    @search_ns.param("keyword", "Search by first or last name")
    @search_ns.marshal_list_with(staff_model)
    def get(self):
        keyword = request.args.get("keyword", "")
        query = Staff.query

        if keyword:
            keyword_like = f"%{keyword}%"
            query = query.filter(
                db.or_(
                    Staff.first_name.ilike(keyword_like),
                    Staff.last_name.ilike(keyword_like),
                )
            )
        return query.all()


@search_ns.route('/patients')
class SearchPatients(Resource):

    @search_ns.param("keyword", "Search by first or last name")
    @search_ns.param("created_date", "Filter by created date (YYYY-MM-DD)")
    @search_ns.param("updated_date", "Filter by updated date (YYYY-MM-DD)")
    @search_ns.param("insurance", "Filter by insurance: true/false")
    @search_ns.marshal_list_with(patient_model)
    def get(self):
        keyword = request.args.get("keyword", "")
        created_date = request.args.get("created_date")
        updated_date = request.args.get("updated_date")
        insurance = request.args.get("insurance")

        query = Patient.query

        if keyword:
            keyword_like = f"%{keyword}%"
            query = query.filter(
                db.or_(
                    Patient.first_name.ilike(keyword_like),
                    Patient.last_name.ilike(keyword_like),
                )
            )

        if created_date:
            query = query.filter(
                db.cast(Patient.created_date, db.String).like(f"{created_date}%")
            )

        if updated_date:
            query = query.filter(
                db.cast(Patient.updated_date, db.String).like(f"{updated_date}%")
            )

        if insurance is not None:
            insurance = insurance.lower()
            if insurance in ["true", "1", "yes"]:
                query = query.filter(Patient.insurance.is_(True))
            elif insurance in ["false", "0", "no"]:
                query = query.filter(Patient.insurance.is_(False))

        return query.all()
