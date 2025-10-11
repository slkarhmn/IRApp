import logging
from flask_restx import Namespace, Resource, fields
from flask import request
from app.extensions.database import db
from app.models.staff import Staff, StaffTitle, Specialties
from app.schemas.staff_schema import StaffSchema, SpecialtySchema

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

staff_ns = Namespace('staff', description='Staff related operations')
specialty_ns = Namespace('specialties', description='Specialty related operations')

staff_schema = StaffSchema()
staffs_schema = StaffSchema(many=True)

specialty_schema = SpecialtySchema()
specialties_schema = SpecialtySchema(many=True)

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
    #def get(self):
    #    """List all staff"""
    #    logger.info("Fetching all staff records")
    #    staffs = Staff.query.all()
    #    return staffs_schema.dump(staffs), 200
    
    @staff_ns.expect(staff_model)
    def post(self):
        """Create a new staff"""
        json_data = request.get_json()
        logger.info("Creating a new staff entry")

        if not json_data:
            logger.warning("No input data provided for new staff")
            return {'message': 'No input data provided'}, 400
        
        try:
            staff = staff_schema.load(json_data)
            if 'title' in json_data:
                staff.title = StaffTitle[json_data['title']]
        except Exception as e:
            logger.error("Staff creation failed: %s", str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        db.session.add(staff)
        db.session.commit()
        logger.info("Staff created successfully: staff_id=%s", staff.staff_id)
        return staff_schema.dump(staff), 201


@staff_ns.route('/<int:id>')
@staff_ns.response(404, 'Staff not found')
class StaffResource(Resource):
    def get(self, id):
        """Get staff by ID"""
        logger.info("Fetching staff with ID: %d", id)
        staff = Staff.query.get_or_404(id)
        return staff_schema.dump(staff), 200

    def put(self, id):
        """Update staff by ID"""
        logger.info("Updating staff with ID: %d", id)
        staff = Staff.query.get_or_404(id)
        json_data = request.get_json()

        if not json_data:
            logger.warning("No input data provided for staff update: ID %d", id)
            return {'message': 'No input data provided'}, 400

        try:
            data = staff_schema.load(json_data, partial=True)
            for key, value in data.__dict__.items():
                if key != '_sa_instance_state':
                    setattr(staff, key, value)
            if 'title' in json_data:
                staff.title = StaffTitle[json_data['title']]
        except Exception as e:
            logger.error("Staff update failed for ID %d: %s", id, str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        db.session.commit()
        logger.info("Staff updated successfully: ID %d", id)
        return staff_schema.dump(staff), 200

    def delete(self, id):
        """Delete staff by ID"""
        logger.info("Deleting staff with ID: %d", id)
        staff = Staff.query.get_or_404(id)
        db.session.delete(staff)
        db.session.commit()
        logger.info("Staff deleted successfully: ID %d", id)
        return '', 204


@specialty_ns.route('/')
class SpecialtyList(Resource):
    def get(self):
        """List all specialties"""
        logger.info("Fetching all specialties")
        specialties = Specialties.query.all()
        return specialties_schema.dump(specialties), 200

    #def post(self):
    #    """Create a new specialty"""
    #    json_data = request.get_json()
    #    logger.info("Creating new specialty")

    #   if not json_data:
    #        logger.warning("No input data provided for specialty creation")
    #        return {'message': 'No input data provided'}, 400

    #    try:
    #        specialty = specialty_schema.load(json_data)
    #    except Exception as e:
    #        logger.error("Specialty creation failed: %s", str(e))
     #       return {'message': 'Validation failed', 'errors': str(e)}, 422

    #    db.session.add(specialty)
    #    db.session.commit()
    #    logger.info("Specialty created successfully: ID %d", specialty.id)
    #    return specialty_schema.dump(specialty), 201


@specialty_ns.route('/<int:id>')
@specialty_ns.response(404, 'Specialty not found')
class SpecialtyResource(Resource):
    def get(self, id):
        """Get a specialty by ID"""
        logger.info("Fetching specialty with ID: %d", id)
        specialty = Specialties.query.get_or_404(id)
        return specialty_schema.dump(specialty), 200

    def put(self, id):
        """Update a specialty"""
        logger.info("Updating specialty with ID: %d", id)
        specialty = Specialties.query.get_or_404(id)
        json_data = request.get_json()

        if not json_data:
            logger.warning("No input data provided for specialty update: ID %d", id)
            return {'message': 'No input data provided'}, 400

        try:
            data = specialty_schema.load(json_data, partial=True)
            for key, value in data.__dict__.items():
                if key != '_sa_instance_state':
                    setattr(specialty, key, value)
        except Exception as e:
            logger.error("Specialty update failed for ID %d: %s", id, str(e))
            return {'message': 'Validation failed', 'errors': str(e)}, 422

        db.session.commit()
        logger.info("Specialty updated successfully: ID %d", id)
        return specialty_schema.dump(specialty), 200

    def delete(self, id):
        """Delete a specialty"""
        logger.info("Deleting specialty with ID: %d", id)
        specialty = Specialties.query.get_or_404(id)
        db.session.delete(specialty)
        db.session.commit()
        logger.info("Specialty deleted successfully: ID %d", id)
        return '', 204
