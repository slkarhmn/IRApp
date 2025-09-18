from app import db
from datetime import datetime


class Patient(db.Model):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    mrn = db.Column(db.String(20), unique=True, nullable=False, index=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(20))
    insurance = db.Column(db.String(100))

    # Medical information
    allergies = db.Column(db.JSON)  # List of allergies
    medications = db.Column(db.JSON)  # List of current medications
    medical_history = db.Column(db.JSON)  # List of medical conditions

    # Vital signs (latest)
    blood_pressure_systolic = db.Column(db.Integer)
    blood_pressure_diastolic = db.Column(db.Integer)
    heart_rate = db.Column(db.Integer)
    temperature = db.Column(db.Float)
    respiratory_rate = db.Column(db.Integer)
    oxygen_saturation = db.Column(db.Integer)
    weight_kg = db.Column(db.Integer)
    height_cm = db.Column(db.Integer)

    # Lab values (latest)
    hemoglobin = db.Column(db.Float)
    hematocrit = db.Column(db.Float)
    platelet_count = db.Column(db.Integer)
    white_blood_cell_count = db.Column(db.Float)
    creatinine = db.Column(db.Float)
    bun = db.Column(db.Integer)
    glucose = db.Column(db.Integer)
    inr = db.Column(db.Float)
    pt = db.Column(db.Float)
    ptt = db.Column(db.Float)

    # Timestamps
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    procedures = db.relationship('Procedure', backref='patient', lazy=True)
    alerts = db.relationship('Alert', backref='patient', lazy=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def active_alerts_count(self):
        return len([alert for alert in self.alerts if alert.status == 'Active'])

    def to_dict(self):
        return {
            'id': self.id,
            'mrn': self.mrn,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'age': self.age,
            'gender': self.gender,
            'phone': self.phone,
            'insurance': self.insurance,
            'allergies': self.allergies or [],
            'medications': self.medications or [],
            'medical_history': self.medical_history or [],
            'vitals': {
                'blood_pressure_systolic': self.blood_pressure_systolic,
                'blood_pressure_diastolic': self.blood_pressure_diastolic,
                'heart_rate': self.heart_rate,
                'temperature': self.temperature,
                'respiratory_rate': self.respiratory_rate,
                'oxygen_saturation': self.oxygen_saturation,
                'weight_kg': self.weight_kg,
                'height_cm': self.height_cm,
            },
            'labs': {
                'hemoglobin': self.hemoglobin,
                'hematocrit': self.hematocrit,
                'platelet_count': self.platelet_count,
                'white_blood_cell_count': self.white_blood_cell_count,
                'creatinine': self.creatinine,
                'bun': self.bun,
                'glucose': self.glucose,
                'inr': self.inr,
                'pt': self.pt,
                'ptt': self.ptt,
            },
            'active_alerts_count': self.active_alerts_count,
            'created_date': self.created_date.isoformat() if self.created_date else None,
            'updated_date': self.updated_date.isoformat() if self.updated_date else None,
        }
