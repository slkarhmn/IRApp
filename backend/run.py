from flask import Flask
from dotenv import load_dotenv
import os

#TODO: Create a SQLite DB config file and make a create db here

def create_app():
    load_dotenv() 

    app = Flask(__name__)

    from app.routes import main
    app.register_blueprint(main)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=False) 