from flask import Blueprint, request, jsonify
from app.models.patient import Patient
from app.services.patient_service import PatientService
from app.utils.validators import validate_patient_data

patients_bp = Blueprint('patients', __name__)
patient_service = PatientService()


@patients_bp.route('/patients', methods=['GET'])
def get_patients():
    """Get all patients with optional filtering"""
    try:
        # Get query parameters
        search = request.args.get('search', '')
        gender = request.args.get('gender', '')
        age_min = request.args.get('age_min', type=int)
        age_max = request.args.get('age_max', type=int)
        has_allergies = request.args.get('has_allergies', type=bool)

        # Build filters
        filters = {}
        if search:
            filters['search'] = search
        if gender:
            filters['gender'] = gender
        if age_min is not None:
            filters['age_min'] = age_min
        if age_max is not None:
            filters['age_max'] = age_max
        if has_allergies is not None:
            filters['has_allergies'] = has_allergies

        patients = patient_service.get_patients(filters)
        return jsonify([patient.to_dict() for patient in patients])

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patients_bp.route('/patients/<int:patient_id>', methods=['GET'])
def get_patient(patient_id):
    """Get specific patient by ID"""
    try:
        patient = patient_service.get_patient_by_id(patient_id)
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        return jsonify(patient.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patients_bp.route('/patients/search', methods=['GET'])
def search_patients():
    """Search patients by name or MRN"""
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({'error': 'Search query required'}), 400

        patients = patient_service.search_patients(query)
        return jsonify([patient.to_dict() for patient in patients])

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patients_bp.route('/patients', methods=['POST'])
def create_patient():
    """Create new patient"""
    try:
        data = request.get_json()

        # Validate data
        errors = validate_patient_data(data)
        if errors:
            return jsonify({'errors': errors}), 400

        patient = patient_service.create_patient(data)
        return jsonify(patient.to_dict()), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
