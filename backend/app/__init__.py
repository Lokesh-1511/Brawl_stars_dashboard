from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes and allow requests from localhost:5173
    CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    from .routes import api
    app.register_blueprint(api, url_prefix='/api')

    return app
