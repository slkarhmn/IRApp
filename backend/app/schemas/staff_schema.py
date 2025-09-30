from marshmallow import Schema, fields, post_load
from app.models.staff import Specialties
from marshmallow.validate import Length
from app.models.staff import Staff, StaffTitle

class SpecialtySchema(Schema):
    id = fields.Int(dump_only=True)
    name = fields.Str(required=True)

    @post_load
    def make_specialty(self, data, **kwargs):
        return Specialties(**data)

class StaffSchema(Schema):
    id = fields.Int(dump_only=True)
    user_id = fields.Int(required=True)
    staff_id = fields.Str(required=True, validate=Length(min=1, max=50))
    first_name = fields.Str(required=True, validate=Length(min=1, max=25))
    last_name = fields.Str(required=True, validate=Length(min=1, max=25))
    
    # Enum field
    title = fields.Enum(StaffTitle, by_value=True, required=True)
    
    # Related specialty (as ID for load, full object for dump)
    specialty = fields.Int(load_only=True, required=True)
    specialty_rel = fields.Nested(SpecialtySchema, dump_only=True)

    # Optionally add related user if needed
    # user = fields.Nested(UserSchema, dump_only=True)  # Only if you want to include user details

    @post_load
    def make_staff(self, data, **kwargs):
        return Staff(**data)