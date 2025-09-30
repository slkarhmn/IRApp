from flask import request, session
from flask_restx import Namespace, Resource, fields
from flask_login import login_user, logout_user, login_required, current_user

from app.models.users import Users, UserType
from app.config import db
from app.schemas.user_schema import UserSchema

user_ns = Namespace('users', description='User operations')

user_schema = UserSchema()
user_schema_partial = UserSchema(partial=True)

# ===== Swagger Models =====
user_input_model = user_ns.model('UserInput', {
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True),
    'user_type': fields.String(required=True, enum=[e.value for e in UserType])
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

# ====== Auth Routes ======

@user_ns.route('/register')
class Register(Resource):
    @user_ns.expect(user_input_model)
    def post(self):
        data = request.json
        # Validate using Marshmallow
        try:
            user_data = user_schema.load(data)
        except Exception as err:
            return {"error": str(err)}, 400

        if Users.query.filter_by(email=user_data.email).first():
            return {"message": "Email already registered"}, 400

        db.session.add(user_data)
        db.session.commit()
        return {"message": "User registered successfully"}, 201


@user_ns.route('/login')
class Login(Resource):
    @user_ns.expect(login_model)
    def post(self):
        data = request.json
        user = Users.query.filter_by(email=data.get("email")).first()
        if not user or not user.verify_password(data.get("password")):
            return {"message": "Invalid email or password"}, 401

        login_user(user)
        return {"message": f"Logged in as {user.first_name}"}, 200


@user_ns.route('/logout')
class Logout(Resource):
    @login_required
    def post(self):
        logout_user()
        return {"message": "Logged out successfully"}, 200


@user_ns.route('/session')
class SessionUser(Resource):
    def get(self):
        if current_user.is_authenticated:
            return user_schema.dump(current_user), 200
        return {"message": "Not logged in"}, 401

# ====== User CRUD ======

@user_ns.route('/')
class UserList(Resource):
    @user_ns.marshal_list_with(user_output_model)
    @login_required
    def get(self):
        return Users.query.all(), 200

    @user_ns.expect(user_input_model)
    def post(self):
        data = request.json
        try:
            user_data = user_schema.load(data)
        except Exception as err:
            return {"error": str(err)}, 400

        if Users.query.filter_by(email=user_data.email).first():
            return {"message": "Email already registered"}, 400

        db.session.add(user_data)
        db.session.commit()
        return {"message": "User created successfully"}, 201


@user_ns.route('/<int:id>')
class UserDetail(Resource):
    @user_ns.marshal_with(user_output_model)
    @login_required
    def get(self, id):
        user = Users.query.get_or_404(id)
        return user, 200

    @user_ns.expect(user_input_model)
    @login_required
    def put(self, id):
        user = Users.query.get_or_404(id)
        data = request.json
        try:
            updated_data = user_schema_partial.load(data)
        except Exception as err:
            return {"error": str(err)}, 400

        for key, value in updated_data.__dict__.items():
            if key != "id":
                setattr(user, key, value)

        db.session.commit()
        return {"message": "User updated"}, 200

    @login_required
    def delete(self, id):
        user = Users.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted'}, 204
