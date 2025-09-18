from app import db
from datetime import datetime


class Procedure(db.Model):
    __tablename__ = 'procedures'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)

    # Procedure details
    procedure_name = db.Column(db.String(200), nullable=False)
    procedure_code = db.Column(db.String(20), nullable=False)
    category = db.Column(db.String(50), nullable=False)

    # Scheduling
    scheduled_date = db.Column(db.DateTime, nullable=False)
    estimated_duration = db.Column(db.Integer)  # in minutes
    location = db.Column(db.String(100))
    physician = db.Column(db.String(100))

    # Status
    status = db.Column(db.String(20), default='Scheduled')  # Scheduled, In Preparation, Ready, In Progress, Completed, Cancelled
    urgency = db.Column(db.String(20), default='Routine')   # Routine, Urgent, Emergent

    # Requirements
    prep_requirements = db.Column(db.JSON)  # List of preparation requirements

    # Timestamps
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    checklist = db.relationship('Checklist', backref='procedure', uselist=False, lazy=True)
    alerts = db.relationship('Alert', backref='procedure', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'patient_id': self.patient_id,
            'patient_name': self.patient.full_name if self.patient else None,
            'patient_mrn': self.patient.mrn if self.patient else None,
            'procedure_name': self.procedure_name,
            'procedure_code': self.procedure_code,
            'category': self.category,
            'scheduled_date': self.scheduled_date.isoformat() if self.scheduled_date else None,
            'estimated_duration': self.estimated_duration,
            'location': self.location,
            'physician': self.physician,
            'status': self.status,
            'urgency': self.urgency,
            'prep_requirements': self.prep_requirements or [],
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'updated_date': self.updated_date.isoformat() if self.updated_date else None,
        }
