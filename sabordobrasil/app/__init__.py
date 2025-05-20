from flask import Flask
from flask_mysqldb import MySQL
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config

mysql = MySQL()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mysql.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from .routes import routes_bp
    from .auth import auth_bp

    app.register_blueprint(routes_bp)
    app.register_blueprint(auth_bp)

    return app
