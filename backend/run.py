from flask import Flask
from flask_restx import Api, Resource

#TODO: Create a SQLite DB config file and make a create db here

def create_app():
    app = Flask(__name__)
    api = Api(app, title="My Flask API", version="1.0", description="A simple API")

    ns = api.namespace('hello', description='Hello operations')

    @ns.route('/')
    class HelloWorld(Resource):
        def get(self):
            """Returns a greeting"""
            return {'message': 'Hello, World!'}

    @app.route("/")
    def home():
        return "HELLO FROM THE HOME PAGE"

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
