from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import fields
from app.models.staff import Staff, Specialties
from app.schemas.user_schema import UserSchema
from app.config import db

class SpecialtySchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Specialties
        load_instance = True
        include_relationships = False 
        sqla_session = db.session
        
class StaffSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Staff
        load_instance = True
        include_fk = True
        include_relationships = True
        sqla_session = db.session

    title = auto_field()

    specialty_rel = fields.Nested(SpecialtySchema, dump_only=True)

    specialty = auto_field(load_only=True)

    users = fields.Nested(UserSchema, dump_only=True)