from app.models.users import Users, UserType
from app.config import db
from flask_restx import Namespace, Resource, fields
from flask import request

user_crud = Namespace('users', description='User operations')

user_input_model = user_crud.model('UserInput', {
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True),
    'user_type': fields.String(required=True, enum=[e.value for e in UserType])
})

user_output_model = user_crud.model('UserOutput', {
    'id': fields.Integer,
    'first_name': fields.String,
    'last_name': fields.String,
    'email': fields.String,
    'user_type': fields.String
})

@user_crud.route('/')
class UserList(Resource):
    @user_crud.marshal_list_with(user_output_model)
    def get(self):
        return Users.query.all(), 200

    @user_crud.expect(user_input_model)
    def post(self):
        data = request.json
        new_user = Users(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            user_type=UserType(data['user_type']),
            password=data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully'}, 201

@user_crud.route('/<int:id>')
class UserDetail(Resource):
    @user_crud.marshal_with(user_output_model)
    def get(self, id):
        user = Users.query.get_or_404(id)
        return user, 200

    @user_crud.expect(user_input_model)
    def put(self, id):
        data = request.json
        user = Users.query.get_or_404(id)
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        user.email = data['email']
        user.user_type = UserType(data['user_type'])
        user.password = data['password']
        db.session.commit()
        return {'message': 'User updated'}, 200

    def delete(self, id):
        user = Users.query.get_or_404(id)
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted'}, 204
    
