from app.config import db
from sqlalchemy import Column, Boolean, Text, Integer, DateTime, String, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum

class StaffTitle(str, PyEnum):
    DR = "Doctor"
    NR = "Nurse"
    
class Staff(db.Model):
    __tablename__ = 'staff'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    staff_id = Column(String(50), index=True)
    first_name = Column(String(25))
    last_name = Column(String(25))
    title = Column(SQLEnum(StaffTitle, name="staff_title_enum"), nullable=False)
    specialty = Column(Integer, ForeignKey('specialties.id'))
    
    users = relationship('Users')
    specialty_rel = relationship("Specialties", back_populates="staff_members")
    
    def __init__(self, user_id, staff_id, first_name, last_name, title, specialty):
        super().__init__()
        self.user_id = user_id
        self.staff_id = staff_id
        self.first_name = first_name
        self.last_name = last_name
        self.title = title
        self.specialty = specialty
    
    @classmethod
    def find_physician_by_id(cls, staff_id):
        return cls.query.filter_by(staff_id=staff_id, title=StaffTitle.DR).first()
        #TODO: Make this return the full name of the doctor / nurse
    
class Specialties(db.Model):
    __tablename__ = 'specialties'
    
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True, nullable=False)
    
    staff_members = relationship("Staff", back_populates="specialty_rel")
    
    def __init__(self, name):
        super().__init__()
        self.name = name
        
    @classmethod
    def list_specialties(cls):
        return cls.query.all()