from app.models.users import Users, UserType
from app.models.staff import Staff, Specialties
from app.models.procedure import Procedures, PatientProcedures
from app.models.checklist import SignIn, SignOut, ProcedurePlanning
from app.models.patient import Patient

def test_new_user():
    """
    GIVEN a User model
    WHEN a new User is created
    THEN check the first_name, last_name, email, password_hash, and user_type fields are defined correctly
    """
    user = Users(first_name="Jane", last_name="Doe", email="dopejane@gmail.com", password="ThisIsVerySecure123!@#", user_type="ST")
    
    assert user.first_name == 'Jane'
    assert user.last_name == 'Doe'
    assert user.email == 'dopejane@gmail.com'
    assert user.password_hash != 'ThisIsVerySecure123!@#'
    assert user.user_type == "ST"

def test_new_staff():
    """
    GIVEN a Staff model
    WHEN a new Staff member is created
    THEN check the user_id, staff_id, first_name, last_name, title, and specialty fields are defined correctly
    """
    
    staff = Staff(user_id="1", staff_id="12434567890ABCD", first_name="Jane", last_name="Doe", title="Doctor", specialty="Cardiology")
    
    assert staff.user_id =="1"
    assert staff.staff_id =="12434567890ABCD"
    assert staff.first_name =="Jane"
    assert staff.last_name =="Doe"
    assert staff.title =="Doctor"
    assert staff.specialty =="Cardiology"

def test_new_speciality():
    """
    GIVEN a Specialties model
    WHEN a new Specialty is created
    THEN check the name field is defined correctly
    """
    speciality = Specialties(name="Interventional Radiologist")
    
    assert speciality.name == "Interventional Radiologist"

def test_new_procedure():
    """
    GIVEN a Procedures model
    WHEN a new Procedure is created
    THEN check the procedure_name, procedure_code, and specialised_checklist fields are defined correctly
    """
    procedure = Procedures(procedure_name="Biopsy", procedure_code="12434234", specialised_checklist="THIS WILL BE JSON")
    
    assert procedure.procedure_name == "Biopsy"
    assert procedure.procedure_code == "12434234"
    assert procedure.specialised_checklist == "THIS WILL BE JSON"

def test_new_patient():
    """
    GIVEN a Patient model
    WHEN a new Patient is created
    THEN check all patient demographic, contact, and medical information fields are defined correctly
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

    assert patient.mrn == "2132412434321341"
    assert patient.first_name == "Robert"
    assert patient.last_name == "Charlie"
    assert patient.age == 65
    assert patient.gender == "M"
    assert patient.phone == "07896 546785"
    assert patient.insurance is True

    assert patient.allergies == "No known drug allergies"
    assert patient.medications == "Aspirin 75 mg once daily"
    assert patient.medical_history == "Total knee replacement (2020)"

    assert patient.blood_pressure_systolic == "135"
    assert patient.blood_pressure_diastolic == "85"
    assert patient.heart_rate_bpm == 72
    assert patient.temperature_celsius == 36.8
    assert patient.respiratory_rate_breaths_per_min == 16
    assert patient.oxygen_saturation_percent == 98.0
    assert patient.weight_kg == 88.5
    assert patient.height_cm == 178

    assert patient.hemoglobin_gL == 145.0
    assert patient.hematocrit_LL == 0.43
    assert patient.platelet_count == "250 x10^9/L"
    assert patient.white_blood_cell_count == "6.8 x10^9/L"
    assert patient.creatinine == "85 µmol/L"
    assert patient.bun_mmolL == 5.0
    assert patient.glucose_mmolL == 5.2
    assert patient.inr == 1.0
    assert patient.pt_seconds == 12.0
    assert patient.ptt_seconds == 30.0

    
def test_new_patient_procedure():
    """
    GIVEN a ProcedurePlanning model
    WHEN a new ProcedurePlanning record is created
    THEN check that all pre-procedure planning fields such as consent, fasting order, and prophylaxis are defined correctly
    """
    
    patient_procedure = PatientProcedures(patient_id="1", procedure_code="47329847", procedure_name="Biopsy1", physician = "Dr Jane Doe", 
                                          status="scheduled", urgency="routine", prep_requirements="Fasting", 
                                          scheduled_date="03/06/2026", created_date="25/05/2026", updated_date="01/06/2026")
    
    assert patient_procedure.patient_id== "1"
    assert patient_procedure.procedure_code == "47329847"
    assert patient_procedure.procedure_name == "Biopsy1"
    assert patient_procedure.physician == "Dr Jane Doe"
    assert patient_procedure.status == "scheduled"
    assert patient_procedure.urgency =="routine"
    assert patient_procedure.prep_requirements =="Fasting"
    assert patient_procedure.scheduled_date == "03/06/2026"
    assert patient_procedure.created_date == "25/05/2026"
    assert patient_procedure.updated_date == "01/06/2026"
    

from app.models.checklist import ProcedurePlanning, SignIn, SignOut

def test_new_procedure_planning():
    """
    GIVEN a ProcedurePlanning model
    WHEN a new ProcedurePlanning is created
    THEN check that all fields are defined correctly
    """
    procedure_planning = ProcedurePlanning(
        procedure_id=1,
        discussed_with_referring_physician=True,
        imaging_studies_reviewed=True,
        relevant_medical_history="Diabetes and hypertension",
        informed_consent=True,
        prophylaxis=True,
        tools_requested_and_present="Scalpel, forceps",
        fasting_order=True,
        relevant_lab_tests="CBC, PT, INR",
        anaesthetist_necessary=True,
        anticoagulant_stopped=True,
        post_precedural_bed_required=True,
        contrast_allergy_prophylaxis_necessary=False
    )

    assert procedure_planning.procedure_id == 1
    assert procedure_planning.discussed_with_referring_physician is True
    assert procedure_planning.imaging_studies_reviewed is True
    assert procedure_planning.relevant_medical_history == "Diabetes and hypertension"
    assert procedure_planning.informed_consent is True
    assert procedure_planning.prophylaxis is True
    assert procedure_planning.tools_requested_and_present == "Scalpel, forceps"
    assert procedure_planning.fasting_order is True
    assert procedure_planning.relevant_lab_tests == "CBC, PT, INR"
    assert procedure_planning.anaesthetist_necessary is True
    assert procedure_planning.anticoagulant_stopped is True
    assert procedure_planning.post_precedural_bed_required is True
    assert procedure_planning.contrast_allergy_prophylaxis_necessary is False


def test_new_sign_in():
    """
    GIVEN a SignIn model
    WHEN a new SignIn is created
    THEN check that all fields are defined correctly
    """
    sign_in = SignIn(
        procedure_id=2,
        team_members_introduced="Dr. Smith, Nurse John",
        records_given_to_patient="CT scan results",
        correct_patient=True,
        correct_side=True,
        correct_site=True,
        patient_fasting_order_followed=True,
        iv_access_necessary=True,
        monitoring_equipment_attached=True,
        checked_lab_tests="CBC normal",
        allergies_checked=True,
        prophylaxis_checked=True,
        drugs_administered="Midazolam",
        complications_discussed="Bleeding risk explained",
        consent_obtained=True
    )

    assert sign_in.procedure_id == 2
    assert sign_in.team_members_introduced == "Dr. Smith, Nurse John"
    assert sign_in.records_given_to_patient == "CT scan results"
    assert sign_in.correct_patient is True
    assert sign_in.correct_side is True
    assert sign_in.correct_site is True
    assert sign_in.patient_fasting_order_followed is True
    assert sign_in.iv_access_necessary is True
    assert sign_in.monitoring_equipment_attached is True
    assert sign_in.checked_lab_tests == "CBC normal"
    assert sign_in.allergies_checked is True
    assert sign_in.prophylaxis_checked is True
    assert sign_in.drugs_administered == "Midazolam"
    assert sign_in.complications_discussed == "Bleeding risk explained"
    assert sign_in.consent_obtained is True


def test_new_sign_out():
    """
    GIVEN a SignOut model
    WHEN a new SignOut is created
    THEN check that all fields are defined correctly
    """
    sign_out = SignOut(
        procedure_id=3,
        post_op_note="Procedure completed successfully",
        vital_signs_normal=True,
        medications_recorded="Paracetamol 1g",
        contrast_media_recorded="Iohexol 300mg/mL",
        lab_tests_requested=True,
        samples_labelled=True,
        samples_sent_to_lab=True,
        procedure_results_discussed_with_patients="Explained procedure outcome",
        post_discharge_instructions_given_to_patient="Rest for 24 hours",
        follow_up_appt_made=True,
        follow_up_appt_date="2025-11-10",
        procedure_results_communicated_to_referring_physician=True
    )

    assert sign_out.procedure_id == 3
    assert sign_out.post_op_note == "Procedure completed successfully"
    assert sign_out.vital_signs_normal is True
    assert sign_out.medications_recorded == "Paracetamol 1g"
    assert sign_out.contrast_media_recorded == "Iohexol 300mg/mL"
    assert sign_out.lab_tests_requested is True
    assert sign_out.samples_labelled is True
    assert sign_out.samples_sent_to_lab is True
    assert sign_out.procedure_results_discussed_with_patients == "Explained procedure outcome"
    assert sign_out.post_discharge_instructions_given_to_patient == "Rest for 24 hours"
    assert sign_out.follow_up_appt_made is True
    assert sign_out.follow_up_appt_date == "2025-11-10"
    assert sign_out.procedure_results_communicated_to_referring_physician is True
