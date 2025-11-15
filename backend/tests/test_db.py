import pytest
import datetime
from app import create_app
from app.extensions.database import db
from app.models.users import Users, UserType
from app.models.staff import Staff, Specialties
from app.models.patient import Patient
from app.models.procedure import Procedures, PatientProcedures
from app.models.checklist import SignIn, SignOut, ProcedurePlanning


@pytest.fixture(scope="function")
def test_client():
    """
    GIVEN a Flask app configured for testing
    WHEN a test client and in-memory database are created
    THEN provide a clean database for each test
    """
    app = create_app("testing")

    app.config.update({
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "TESTING": True,
    })

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()


def test_user_database(test_client):
    """
    GIVEN
    WHEN
    THEN
    """
    
    new_user = Users(first_name="Jane", last_name="Doe", 
                 email="dopejane@gmail.com", password="ThisIsVerySecure123!@#", 
                 user_type=UserType.ST)
    
    db.session.add(new_user)
    db.session.commit()

    retrieved = Users.query.filter_by(id=new_user.id).first()
    assert retrieved.first_name == 'Jane'
    assert retrieved.last_name == 'Doe'
    assert retrieved.email == 'dopejane@gmail.com'
    assert retrieved.password_hash != 'ThisIsVerySecure123!@#'
    assert retrieved.user_type == UserType.ST

def test_staff_database(test_client):
    """
    GIVEN
    WHEN
    THEN
    """
    
    user = Users(first_name="Jane", last_name="Doe", 
                 email="dopejane@gmail.com", password="ThisIsVerySecure123!@#", 
                 user_type="ST")
    
    speciality = Specialties(name="Interventional Radiologist")
    
    db.session.add(user)
    db.session.add(speciality)
    db.session.commit()
    
    staff = Staff(user_id=user.id, staff_id="12434567890ABCD", 
                  first_name="Jane", last_name="Doe", title="Doctor", 
                  specialty=speciality.name)
    
    db.session.add(staff)
    db.session.commit()
    
    retrieved = Staff.query.filter_by(staff_id=staff.staff_id).first()
    
    assert retrieved.id == user.id
    assert retrieved.staff_id =="12434567890ABCD"
    assert retrieved.first_name =="Jane"
    assert retrieved.last_name == "Doe"
    assert retrieved.title =="Doctor"
    assert retrieved.specialty == speciality.name
    

def test_speciality_database(test_client):
    """
    GIVEN
    WHEN
    THEN
    """
    
    speciality = Specialties(name="Interventional Radiologist")
    db.session.add(speciality)
    db.session.commit()
    
    retrieved = Specialties.query.first()
    
    assert retrieved.name == "Interventional Radiologist"
    
    
def test_patient_database(test_client):
    """
    GIVEN a database and the Patient model
    WHEN a new Patient is added and committed
    THEN the patient can be retrieved and all fields match the inserted values
    """

    patient = Patient(
        mrn="2132412434321341",
        first_name="Robert",
        last_name="Charlie",
        age=65,
        gender="M",
        phone="07896 546785",
        insurance=True,
        allergies="No known drug allergies",
        medications="Aspirin 75 mg once daily",
        medical_history="Total knee replacement (2020)",
        blood_pressure_systolic="135",
        blood_pressure_diastolic="85",
        heart_rate_bpm=72,
        temperature_celsius=36.8,
        respiratory_rate_breaths_per_min=16,
        oxygen_saturation_percent=98.0,
        weight_kg=88.5,
        height_cm=178,
        hemoglobin_gL=145.0,
        hematocrit_LL=0.43,
        platelet_count="250 x10^9/L",
        white_blood_cell_count="6.8 x10^9/L",
        creatinine="85 µmol/L",
        bun_mmolL=5.0,
        glucose_mmolL=5.2,
        inr=1.0,
        pt_seconds=12.0,
        ptt_seconds=30.0
    )

    db.session.add(patient)
    db.session.commit()

    retrieved = Patient.query.filter_by(mrn=patient.mrn).first()

    assert retrieved is not None
    assert retrieved.mrn == "2132412434321341"
    assert retrieved.first_name == "Robert"
    assert retrieved.last_name == "Charlie"
    assert retrieved.age == 65
    assert retrieved.gender == "M"
    assert retrieved.phone == "07896 546785"
    assert retrieved.insurance is True

    assert retrieved.allergies == "No known drug allergies"
    assert retrieved.medications == "Aspirin 75 mg once daily"
    assert retrieved.medical_history == "Total knee replacement (2020)"

    assert retrieved.blood_pressure_systolic == "135"
    assert retrieved.blood_pressure_diastolic == "85"
    assert retrieved.heart_rate_bpm == 72
    assert retrieved.temperature_celsius == 36.8
    assert retrieved.respiratory_rate_breaths_per_min == 16
    assert retrieved.oxygen_saturation_percent == 98.0
    assert retrieved.weight_kg == 88.5
    assert retrieved.height_cm == 178

    assert retrieved.hemoglobin_gL == 145.0
    assert retrieved.hematocrit_LL == 0.43
    assert retrieved.platelet_count == "250 x10^9/L"
    assert retrieved.white_blood_cell_count == "6.8 x10^9/L"
    assert retrieved.creatinine == "85 µmol/L"
    assert retrieved.bun_mmolL == 5.0
    assert retrieved.glucose_mmolL == 5.2
    assert retrieved.inr == 1.0
    assert retrieved.pt_seconds == 12.0
    assert retrieved.ptt_seconds == 30.0

    
def test_procedure_database(test_client):
    """
    GIVEN
    WHEN
    THEN
    """
    
    procedure = Procedures(procedure_name="Biopsy", procedure_code="12434234", 
                           specialised_checklist="THIS WILL BE JSON")
    
    db.session.add(procedure)
    db.session.commit()
    
    retrieved = Procedures.query.filter_by(procedure_name=procedure.procedure_name).first()
    assert retrieved.procedure_name == "Biopsy"
    assert retrieved.procedure_code == "12434234"
    assert retrieved.specialised_checklist == "THIS WILL BE JSON"

def test_procedure_planning_database(test_client):
    """
    GIVEN a ProcedurePlanning model
    WHEN a new record is added to the database
    THEN it should be retrievable with the same field values
    """
    
    scheduled_date = datetime.datetime(2025, 11, 1, 13, 30, 0)
    created_date = datetime.datetime(2025, 10, 20, 17, 25, 48)
    updated_date = datetime.datetime(2025, 10, 22, 10, 1, 56)
    
    procedure = PatientProcedures(
        patient_id=1,
        procedure_id=1,
        physician="Dr Alice Brown",
        status="scheduled",
        urgency="routine",
        prep_requirements="Fasting for 6 hours",
        scheduled_date=scheduled_date,
        created_date=created_date,
        updated_date=updated_date
    )
    db.session.add(procedure)
    db.session.commit()

    planning = ProcedurePlanning(
        procedure_id=procedure.id,
        discussed_with_referring_physician=True,
        imaging_studies_reviewed=True,
        relevant_medical_history="Asthma, hypertension",
        informed_consent=True,
        prophylaxis=False,
        tools_requested_and_present="Biopsy needle set",
        fasting_order=True,
        relevant_lab_tests="INR 1.0, Platelets 250 x10^9/L",
        anaesthetist_necessary=False,
        anticoagulant_stopped=True,
        post_precedural_bed_required=True,
        contrast_allergy_prophylaxis_necessary=False
    )
    db.session.add(planning)
    db.session.commit()

    retrieved = ProcedurePlanning.query.filter_by(procedure_id=procedure.id).first()
    assert retrieved is not None
    assert retrieved.informed_consent is True
    assert retrieved.discussed_with_referring_physician is True
    assert retrieved.imaging_studies_reviewed is True
    assert retrieved.fasting_order is True
    assert retrieved.relevant_medical_history == "Asthma, hypertension"
    assert retrieved.tools_requested_and_present == "Biopsy needle set"
    assert retrieved.anticoagulant_stopped is True
    assert retrieved.post_precedural_bed_required is True


def test_sign_in_database(test_client):
    """
    GIVEN a SignIn model
    WHEN a new record is added to the database
    THEN it should be retrievable with the same field values
    """
    scheduled_date = datetime.datetime(2025, 10, 30, 14, 45, 0)
    created_date = datetime.datetime(2025, 10, 22, 19, 35, 28)
    updated_date = datetime.datetime(2025, 10, 23, 11, 3, 26)
    
    procedure = PatientProcedures(
        patient_id=2,
        procedure_id=1,
        procedure_name="Ultrasound-Guided Liver Biopsy",
        physician="Dr James Patel",
        status="ready",
        urgency="urgent",
        prep_requirements="Nil by mouth for 4 hours",
        scheduled_date=scheduled_date,
        created_date=created_date,
        updated_date=updated_date
    )
    db.session.add(procedure)
    db.session.commit()

    sign_in = SignIn(
        procedure_id=procedure.id,
        team_members_introduced="Dr Patel, Nurse Green",
        records_given_to_patient="Pre-op imaging",
        correct_patient=True,
        correct_side=True,
        correct_site=True,
        patient_fasting_order_followed=True,
        iv_access_necessary=True,
        monitoring_equipment_attached=True,
        checked_lab_tests="All within normal range",
        allergies_checked=True,
        prophylaxis_checked=True,
        drugs_administered="Midazolam 2mg IV",
        complications_discussed="Bleeding risk discussed",
        consent_obtained=True
    )
    db.session.add(sign_in)
    db.session.commit()

    retrieved = SignIn.query.filter_by(procedure_id=procedure.id).first()
    assert retrieved is not None
    assert retrieved.correct_patient is True
    assert retrieved.correct_side is True
    assert retrieved.correct_site is True
    assert retrieved.iv_access_necessary is True
    assert retrieved.allergies_checked is True
    assert retrieved.prophylaxis_checked is True
    assert retrieved.drugs_administered == "Midazolam 2mg IV"
    assert retrieved.consent_obtained is True


def test_sign_out_database(test_client):
    """
    GIVEN a SignOut model
    WHEN a new record is added to the database
    THEN it should be retrievable with the same field values
    """
    
    scheduled_date = datetime.datetime(2025, 10, 25, 19, 0, 0)
    created_date = datetime.datetime(2025, 10, 22, 9, 49, 28)
    updated_date = datetime.datetime(2025, 10, 23, 21, 3, 56)

    procedure = PatientProcedures(
        patient_id=3,
        procedure_id=1,
        procedure_name="CT Abdomen with Contrast",
        physician="Dr Sarah Johnson",
        status="completed",
        urgency="routine",
        prep_requirements="Hydration pre-procedure",
        scheduled_date=scheduled_date,
        created_date=created_date,
        updated_date=updated_date
    )
    db.session.add(procedure)
    db.session.commit()
    
    follow_up_date = datetime.datetime(2025, 11, 10, 13, 0, 0)
    
    sign_out = SignOut(
        procedure_id=procedure.id,
        post_op_note="Patient tolerated procedure well",
        vital_signs_normal=True,
        medications_recorded="Paracetamol 1g orally",
        contrast_media_recorded="Iohexol 300 mg/mL, 100 mL used",
        lab_tests_requested=False,
        samples_labelled=True,
        samples_sent_to_lab=True,
        procedure_results_discussed_with_patients="Results will be sent to GP",
        post_discharge_instructions_given_to_patient="Rest for 24 hours, avoid driving",
        follow_up_appt_made=True,
        follow_up_appt_date=follow_up_date,
        procedure_results_communicated_to_referring_physician=True
    )
    db.session.add(sign_out)
    db.session.commit()

    retrieved = SignOut.query.filter_by(procedure_id=procedure.id).first()
    assert retrieved is not None
    assert retrieved.vital_signs_normal is True
    assert retrieved.samples_labelled is True
    assert retrieved.samples_sent_to_lab is True
    assert retrieved.post_discharge_instructions_given_to_patient == "Rest for 24 hours, avoid driving"
    assert retrieved.follow_up_appt_made is True
    assert retrieved.procedure_results_communicated_to_referring_physician is True
