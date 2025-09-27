from app.config import db
from sqlalchemy import Column, Boolean, Text, Integer, DateTime, String, Enum as SQLEnum, ForeignKey
from enum import Enum as PyEnum

class StaffTitle(str, PyEnum):
    DR = "Doctor"
    NR = "Nurse"
    
class Staff(db.Model):
    __tablename__ = 'staff'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    staff_id = Column(String)
    first_name = Column(String)
    last_name = Column(String)
    title = Column(SQLEnum(StaffTitle, name="staff_title_enum"), nullable=False)
    specialty = Column(Integer, ForeignKey('specialties.id'))
    
    
class Specialties(db.Model):
    __tablename__ = 'specialties'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, nullable=False)