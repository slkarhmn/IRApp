import pytest
from app import create_app, db
from app.models.patient import Patient
from app.services.patient_service import PatientService


@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def patient_service():
    return PatientService()


def test_create_patient(app, patient_service):
    with app.app_context():
        patient_data = {
            'mrn': 'MRN1000001',
            'first_name': 'John',
            'last_name': 'Doe',
            'age': 45,
            'gender': 'Male',
            'allergies': ['Penicillin'],
        }

        patient = patient_service.create_patient(patient_data)

        assert patient.id is not None
        assert patient.mrn == 'MRN1000001'
        assert patient.full_name == 'John Doe'
        assert patient.allergies == ['Penicillin']


def test_search_patients(app, patient_service):
    with app.app_context():
        # Create test patients
        patient1 = Patient(mrn='MRN001', first_name='John', last_name='Doe', age=45, gender='Male')
        patient2 = Patient(mrn='MRN002', first_name='Jane', last_name='Smith', age=35, gender='Female')
        db.session.add_all([patient1, patient2])
        db.session.commit()

        # Search by first name
        results = patient_service.search_patients('John')
        assert len(results) == 1
        assert results[0].first_name == 'John'

        # Search by MRN
        results = patient_service.search_patients('MRN002')
        assert len(results) == 1
        assert results[0].mrn == 'MRN002'
