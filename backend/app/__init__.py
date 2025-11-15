from .extensions.database import db
from .config import config as AppConfig
from .utils import data_loader
from flask import Flask, Blueprint
from flask_migrate import Migrate
from flask_restx import Api
from .extensions.login_manager import login_manager
from .routes.user_routes import user_ns as UserAPI
from .routes.staff_routes import staff_ns as StaffAPI, specialty_ns as SpecialtyAPI
from .routes.procedures_route import patient_procedure_ns as PatientProcedureAPI, procedure_ns as ProceduresAPI
from .routes.patients_route import patient_ns as PatientsAPI
from .routes.checklists_route import checklist_ns as ChecklistAPI
from .routes.search_route import search_ns as SearchAPI

def create_app(config_setting):
    app = Flask(__name__)
    app.config.from_object(AppConfig[config_setting]) 
    
    db.init_app(app)
    Migrate(app, db)
    
    login_manager.init_app(app)
    
    api_bp = Blueprint('api', __name__, url_prefix='/api')
    api = Api(api_bp, title='Main API', version='1.0', description='API documentation')

    api.add_namespace(ProceduresAPI, path='/procedures')
    api.add_namespace(SpecialtyAPI, path='/specialties')
    api.add_namespace(SearchAPI, path='/search')

    api.add_namespace(UserAPI, path='/users')
    api.add_namespace(StaffAPI, path='/staff') 
    api.add_namespace(PatientsAPI, path='/patients')
    api.add_namespace(PatientProcedureAPI, path='/patient-procedures')
    api.add_namespace(ChecklistAPI, path='/checklist')

    app.register_blueprint(api_bp)

    print("API and namespaces initialized.")

    with app.app_context():
        print(f"Creating DB at: {app.config['SQLALCHEMY_DATABASE_URI']}")
        db.create_all()
        print("Database should now exist.")
        print("Initialising data")
        data_loader.load_initial_procedure_data()
        print("Data initialised.")
        

    return app
