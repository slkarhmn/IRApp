from app.config import db, config as AppConfig
from flask import Flask
from flask_migrate import Migrate
from flask_restx import Api
from app.routes.user_routes import user_crud as UserAPI

def create_app(config_setting):
    app = Flask(__name__)
    app.config.from_object(AppConfig[config_setting]) 
    
    db.init_app(app)
    Migrate(app, db)
    
    api = Api(app)
    api.add_namespace(UserAPI, path='/users')
    print("API Initialised")

    with app.app_context():
        print(f"Creating DB at: {app.config['SQLALCHEMY_DATABASE_URI']}")
        db.create_all()
        print("Database should now exist.")

    return app
