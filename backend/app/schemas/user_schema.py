from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import post_load, post_dump, EXCLUDE, fields, ValidationError, validates
from marshmallow_enum import EnumField
from app.models.users import Users, UserType
from app.config import db

class UserSchema(SQLAlchemySchema):
    class Meta:
        model = Users
        load_instance = True
        include_relationships = True
        unknown = EXCLUDE 
        sqla_session = db.session

    id = auto_field(dump_only=True)
    first_name = auto_field(required=True)
    last_name = auto_field(required=True)
    email = auto_field(required=True)
    user_type = fields.String(required=True)

    password = fields.String(load_only=True, required=True)

    @validates('user_type')
    def validate_user_type(self, value, **kwargs):
        if value not in [e.value for e in UserType]:
            raise ValidationError(f"Invalid user_type: {value}")

    @post_load
    def make_user(self, obj, **kwargs):
        if isinstance(obj, Users):
            if hasattr(obj, 'password'):
                pass
            return obj
        else:
            password = obj.pop('password', None)
            obj['user_type'] = UserType(obj['user_type'])
            return Users(**obj, password=password)


class UserOutputSchema(SQLAlchemySchema):
    class Meta:
        model = Users
        load_instance = False
        sqla_session = db.session

    id = auto_field()
    first_name = auto_field()
    last_name = auto_field()
    email = auto_field()
    user_type = fields.Method("get_user_type_value")

    def get_user_type_value(self, obj):
        if obj.user_type:
            return obj.user_type.value
        return None
