from app.config import db
from sqlalchemy import Column, Boolean, Text, Integer, DateTime, String, Enum as SQLEnum, UniqueConstraint
from sqlalchemy.orm import relationship
from flask_login import UserMixin
from enum import Enum as PyEnum
from werkzeug.security import generate_password_hash, gen_salt, check_password_hash

class UserType(str, PyEnum):
    PT = 'Patient'
    ST = 'Staff'
    
class Users(db.Model, UserMixin):
    __tablename__ = 'users'
    __table_args__ = (
        UniqueConstraint('email', name='uq_users_email'),
    )
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(25), nullable=False)
    last_name = Column(String(25), nullable=False)
    email = Column(String(50), nullable=False, index=True)
    password_hash = Column(String(128), nullable=False)
    user_type = Column(SQLEnum(UserType, name="user_type_enum"), nullable=False)
    
    staff = relationship("Staff", back_populates="users", uselist=False)
    
    def __init__(self, first_name, last_name, email, user_type, password):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.user_type = user_type
        self.password = password 
    
    @property
    def password(self):
        raise AttributeError('Password is not a readable attribute!')
    
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
