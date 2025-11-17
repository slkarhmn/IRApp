from flask_login import LoginManager
from app.models.users import Users

login_manager = LoginManager()
@login_manager.user_loader
def load_user(user_id):
    return Users.query.get(int(user_id))