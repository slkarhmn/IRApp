import pytest
from app import create_app
from app.config import config as AppConfig

@pytest.fixture()
def app():
    app = create_app(config_setting="default")
    app.config.update({
        "Config": True,
    })

    # other setup can go here

    yield app

    # clean up / reset resources here

@pytest.fixture()
def client(app):
    return app.test_client()


# @pytest.fixture()
# def runner(app):
#     return app.test_cli_runner()

# def test_request_users(client):
#     response = client.get("/api/users/")
    
#     assert b"HELLO" in response.data