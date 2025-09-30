from flask_restx import Namespace, Resource, fields
from flask import request
from app.config import db
from app.models.staff import Staff, StaffTitle, Specialties

staff_ns = Namespace('staff', description='Staff related operations')

staff_model = staff_ns.model('Staff', {
    'id': fields.Integer(readonly=True),
    'user_id': fields.Integer(required=True),
    'staff_id': fields.String(required=True),
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'title': fields.String(enum=[t.name for t in StaffTitle], required=True),
    'specialty': fields.Integer(required=True),
})

@staff_ns.route('/')
class StaffList(Resource):
    @staff_ns.marshal_list_with(staff_model)
    def get(self):
        """List all staff"""
        return Staff.query.all()

    @staff_ns.expect(staff_model)
    @staff_ns.marshal_with(staff_model, code=201)
    def post(self):
        """Create a new staff"""
        data = request.json
        try:
            new_staff = Staff(
                user_id=data['user_id'],
                staff_id=data['staff_id'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                title=StaffTitle[data['title']],
                specialty=data['specialty']
            )
            db.session.add(new_staff)
            db.session.commit()
            return new_staff, 201
        except Exception as e:
            staff_ns.abort(400, str(e))

@staff_ns.route('/<int:id>')
@staff_ns.response(404, 'Staff not found')
class StaffResource(Resource):
    @staff_ns.marshal_with(staff_model)
    def get(self, id):
        """Get staff by ID"""
        staff = Staff.query.get_or_404(id)
        return staff

    @staff_ns.expect(staff_model)
    @staff_ns.marshal_with(staff_model)
    def put(self, id):
        """Update staff by ID"""
        staff = Staff.query.get_or_404(id)
        data = request.json
        try:
            staff.user_id = data['user_id']
            staff.staff_id = data['staff_id']
            staff.first_name = data['first_name']
            staff.last_name = data['last_name']
            staff.title = StaffTitle[data['title']]
            staff.specialty = data['specialty']
            db.session.commit()
            return staff
        except Exception as e:
            staff_ns.abort(400, str(e))

    @staff_ns.response(204, 'Staff deleted')
    def delete(self, id):
        """Delete staff by ID"""
        staff = Staff.query.get_or_404(id)
        db.session.delete(staff)
        db.session.commit()
        return '', 204

specialty_ns = Namespace('specialties', description='Specialty related operations')

# === Serializer ===
specialty_model = specialty_ns.model('Specialty', {
    'id': fields.Integer(readonly=True),
    'name': fields.String(required=True, description='Specialty name'),
})

@specialty_ns.route('/')
class SpecialtyList(Resource):
    @specialty_ns.marshal_list_with(specialty_model)
    def get(self):
        """List all specialties"""
        return Specialties.query.all()

    @specialty_ns.expect(specialty_model)
    @specialty_ns.marshal_with(specialty_model, code=201)
    def post(self):
        """Create a new specialty"""
        data = request.json
        new_specialty = Specialties(name=data['name'])
        db.session.add(new_specialty)
        db.session.commit()
        return new_specialty, 201

@specialty_ns.route('/<int:id>')
@specialty_ns.response(404, 'Specialty not found')
class SpecialtyResource(Resource):
    @specialty_ns.marshal_with(specialty_model)
    def get(self, id):
        """Get a specialty by ID"""
        return Specialties.query.get_or_404(id)

    @specialty_ns.expect(specialty_model)
    @specialty_ns.marshal_with(specialty_model)
    def put(self, id):
        """Update a specialty"""
        specialty = Specialties.query.get_or_404(id)
        data = request.json
        specialty.name = data['name']
        db.session.commit()
        return specialty

    @specialty_ns.response(204, 'Specialty deleted')
    def delete(self, id):
        """Delete a specialty"""
        specialty = Specialties.query.get_or_404(id)
        db.session.delete(specialty)
        db.session.commit()
        return '', 204