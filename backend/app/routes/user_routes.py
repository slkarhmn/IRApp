import logging
from flask import request
from flask_restx import Namespace, Resource, fields
from flask_login import login_user, logout_user, login_required, current_user

from app.models.users import Users, UserType
from app.config import db
from app.schemas.user_schema import UserSchema

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

user_ns = Namespace('users', description='User operations')

user_schema = UserSchema()
user_schema_partial = UserSchema(partial=True)

user_input_model = user_ns.model('UserInput', {
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True),
    'user_type': fields.String(required=True)
})

user_output_model = user_ns.model('UserOutput', {
    'id': fields.Integer,
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String,
    'user_type': fields.String
})

login_model = user_ns.model('LoginInput', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
})


@user_ns.route('/register')
class Register(Resource):
    @user_ns.expect(user_input_model)
    def post(self):
        data = request.json
        logger.info("Register attempt for email: %s", data.get("email"))

        if Users.query.filter_by(email=data.get("email")).first():
            logger.warning("Registration failed: Email %s already registered", data.get("email"))
            return {"message": "Email already registered"}, 400

        try:
            user = user_schema.load(data, db.session)
        except Exception as err:
            logger.error("User registration error: %s", str(err))
            return {"error": str(err)}, 400

        db.session.add(user)
        db.session.commit()
        logger.info("User registered successfully: %s", user.email)
        return {"message": "User registered successfully"}, 201


@user_ns.route('/login')
class Login(Resource):
    @user_ns.expect(login_model)
    def post(self):
        data = request.json
        logger.info("Login attempt for email: %s", data.get("email"))

        user = Users.query.filter_by(email=data.get("email")).first()

        if not user or not user.verify_password(data.get("password")):
            logger.warning("Login failed for email: %s", data.get("email"))
            return {"message": "Invalid email or password"}, 401

        login_user(user)
        logger.info("User logged in: %s", user.email)
        return {"message": f"Logged in as {user.first_name}"}, 200


@user_ns.route('/logout')
class Logout(Resource):
    @login_required
    def post(self):
        logger.info("User logged out: %s", current_user.email)
        logout_user()
        return {"message": "Logged out successfully"}, 200


@user_ns.route('/session')
class SessionUser(Resource):
    #@login_required
    @user_ns.marshal_with(user_output_model)
    def get(self):
        logger.info("Session check for user: %s", current_user.email if current_user else 'Anonymous')
        return current_user, 200


@user_ns.route('/')
class UserList(Resource):
    #@login_required
    @user_ns.marshal_list_with(user_output_model)
    def get(self):
        logger.info("Fetching all users")
        return Users.query.all(), 200

    @user_ns.expect(user_input_model)
    def post(self):
        data = request.json
        logger.info("Attempt to create user with email: %s", data.get("email"))

        if Users.query.filter_by(email=data.get("email")).first():
            logger.warning("User creation failed: Email %s already exists", data.get("email"))
            return {"message": "Email already registered"}, 400

        try:
            user = user_schema.load(data)
        except Exception as err:
            logger.error("User creation error: %s", str(err))
            return {"error": str(err)}, 400

        db.session.add(user)
        db.session.commit()
        logger.info("User created successfully: %s", user.email)
        return {"message": "User created successfully"}, 201


@user_ns.route('/<int:id>')
class UserDetail(Resource):
    #@login_required
    @user_ns.marshal_with(user_output_model)
    def get(self, id):
        logger.info("Fetching user with ID: %d", id)
        user = Users.query.get_or_404(id)
        return user, 200

    #@login_required
    @user_ns.expect(user_input_model)
    def put(self, id):
        logger.info("Attempt to update user with ID: %d", id)
        user = Users.query.get_or_404(id)
        data = request.json

        try:
            user_schema_partial.load(data, instance=user)
        except Exception as err:
            logger.error("User update error for ID %d: %s", id, str(err))
            return {"error": str(err)}, 400

        db.session.commit()
        logger.info("User updated successfully: ID %d", id)
        return {"message": "User updated successfully"}, 200

    #@login_required
    def delete(self, id):
        logger.info("Attempt to delete user with ID: %d", id)
        user = Users.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        logger.info("User deleted: ID %d", id)
        return {'message': 'User deleted'}, 204
