from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow import Schema, fields, validate, post_load, EXCLUDE
from app.models.users import UserType, Users


class UserSchema(Schema):
    class Meta:
        unknown = EXCLUDE 

    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=25))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=25))
    email = fields.Email(required=True)


    password = fields.Str(
        load_only=True,
        required=True,
        validate=validate.Regexp(
            r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$',
            error="Password must be at least 8 characters long and include at least one letter and one number."
        )
    )

 
    user_type = fields.Enum(UserType, by_value=True, required=True)

    @post_load
    def make_user(self, data, **kwargs):
        return Users(**data)
