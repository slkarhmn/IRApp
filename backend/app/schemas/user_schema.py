from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    first_name = fields.Str(required=True, validate=validate.Length(min=1, max=25))
    last_name = fields.Str(required=True, validate=validate.Length(min=1, max=25))
    email = fields.Email(required=True)
    
#TODO:add the user type and password class and use enums