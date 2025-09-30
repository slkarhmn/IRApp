from flask_restx import Namespace, Resource, fields
from flask import request
from datetime import datetime
from app.config import db
from app.models.patient import Patient

patient_ns = Namespace('patients', description='Patient records')

patient_model = patient_ns.model('Patient', {
    'id': fields.Integer(readonly=True),
    'mrn': fields.String(required=True),
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'age': fields.Integer(required=True),
    'gender': fields.String(required=True),
    'phone': fields.String(),
    'insurance': fields.Boolean(),

    'allergies': fields.String(),
    'medications': fields.String(),
    'medical_history': fields.Raw(),

    'blood_pressure_systolic': fields.String(),
    'blood_pressure_diastolic': fields.String(),
    'heart_rate': fields.Integer(),
    'temperature': fields.Float(),
    'respiratory_rate': fields.Integer(),
    'oxygen_saturation': fields.Float(),
    'weight_kg': fields.Float(),
    'height_cm': fields.Float(),

    'hemoglobin': fields.Float(),
    'hematocrit': fields.Float(),
    'platelet_count': fields.Float(),
    'white_blood_cell_count': fields.Float(),
    'creatinine': fields.Float(),
    'bun': fields.Float(),
    'glucose': fields.Float(),
    'inr': fields.Float(),
    'pt': fields.Float(),
    'ptt': fields.Float(),

    'created_date': fields.DateTime(),
    'updated_date': fields.DateTime(),
})

def update_patient_from_data(patient, data):
    for field in data:
        if hasattr(patient, field):
            setattr(patient, field, data[field])
    patient.updated_date = datetime.utcnow()

@patient_ns.route('/')
class PatientList(Resource):
    @patient_ns.marshal_list_with(patient_model)
    def get(self):
        """List all patients"""
        return Patient.query.all()

    @patient_ns.expect(patient_model)
    @patient_ns.marshal_with(patient_model, code=201)
    def post(self):
        """Create a new patient"""
        data = request.json
        now = datetime.utcnow()
        patient = Patient(
            mrn=data['mrn'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            age=data['age'],
            gender=data['gender'],
            phone=data.get('phone'),
            insurance=data.get('insurance'),
            allergies=data.get('allergies'),
            medications=data.get('medications'),
            medical_history=data.get('medical_history'),
            blood_pressure_systolic=data.get('blood_pressure_systolic'),
            blood_pressure_diastolic=data.get('blood_pressure_diastolic'),
            heart_rate=data.get('heart_rate'),
            temperature=data.get('temperature'),
            respiratory_rate=data.get('respiratory_rate'),
            oxygen_saturation=data.get('oxygen_saturation'),
            weight_kg=data.get('weight_kg'),
            height_cm=data.get('height_cm'),
            hemoglobin=data.get('hemoglobin'),
            hematocrit=data.get('hematocrit'),
            platelet_count=data.get('platelet_count'),
            white_blood_cell_count=data.get('white_blood_cell_count'),
            creatinine=data.get('creatinine'),
            bun=data.get('bun'),
            glucose=data.get('glucose'),
            inr=data.get('inr'),
            pt=data.get('pt'),
            ptt=data.get('ptt'),
            created_date=now,
            updated_date=now,
        )
        db.session.add(patient)
        db.session.commit()
        return patient, 201

@patient_ns.route('/<int:id>')
@patient_ns.response(404, 'Patient not found')
class PatientResource(Resource):
    @patient_ns.marshal_with(patient_model)
    def get(self, id):
        """Get patient by ID"""
        return Patient.query.get_or_404(id)

    @patient_ns.expect(patient_model)
    @patient_ns.marshal_with(patient_model)
    def put(self, id):
        """Update a patient"""
        patient = Patient.query.get_or_404(id)
        data = request.json
        update_patient_from_data(patient, data)
        db.session.commit()
        return patient

    @patient_ns.response(204, 'Patient deleted')
    def delete(self, id):
        """Delete a patient"""
        patient = Patient.query.get_or_404(id)
        db.session.delete(patient)
        db.session.commit()
        return '', 204

