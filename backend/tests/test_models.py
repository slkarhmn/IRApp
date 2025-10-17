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
    
    
