from app.models.patient import Patient
from app import db
from sqlalchemy import or_, and_


class PatientService:
    def get_patients(self, filters=None):
        """Get patients with optional filtering"""
        query = Patient.query

        if filters:
            # Search filter
            if 'search' in filters:
                search_term = f"%{filters['search']}%"
                query = query.filter(
                    or_(
                        Patient.first_name.ilike(search_term),
                        Patient.last_name.ilike(search_term),
                        Patient.mrn.ilike(search_term)
                    )
                )

            # Gender filter
            if 'gender' in filters:
                query = query.filter(Patient.gender == filters['gender'])

            # Age filters
            if 'age_min' in filters:
                query = query.filter(Patient.age >= filters['age_min'])
            if 'age_max' in filters:
                query = query.filter(Patient.age <= filters['age_max'])

            # Allergies filter
            if 'has_allergies' in filters:
                if filters['has_allergies']:
                    query = query.filter(Patient.allergies.isnot(None))
                else:
                    query = query.filter(Patient.allergies.is_(None))

        return query.order_by(Patient.last_name, Patient.first_name).all()

    def get_patient_by_id(self, patient_id):
        """Get patient by ID"""
        return Patient.query.get(patient_id)

    def search_patients(self, query_string):
        """Search patients by name or MRN"""
        search_term = f"%{query_string}%"
        return Patient.query.filter(
            or_(
                Patient.first_name.ilike(search_term),
                Patient.last_name.ilike(search_term),
                Patient.mrn.ilike(search_term)
            )
        ).order_by(Patient.last_name, Patient.first_name).limit(20).all()

    def create_patient(self, data):
        """Create new patient"""
        patient = Patient(
            mrn=data['mrn'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            age=data['age'],
            gender=data['gender'],
            phone=data.get('phone'),
            insurance=data.get('insurance'),
            allergies=data.get('allergies', []),
            medications=data.get('medications', []),
            medical_history=data.get('medical_history', [])
        )

        db.session.add(patient)
        db.session.commit()

        return patient
