from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

def create_app():
    app = Flask(__name__)
    
    # Load environment variables
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
    
    # Configure Flask
    app.config['JSON_SORT_KEYS'] = False
    app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
    
    # Enable CORS for all routes and allow requests from localhost:5173 (Vite default)
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })

    # Register blueprints
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "error": "Not Found",
            "message": "The requested resource was not found"
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            "error": "Internal Server Error",
            "message": "An unexpected error occurred"
        }), 500
    
    @app.route('/')
    def index():
        return jsonify({
            "message": "Brawl Stars Dashboard API",
            "version": "1.0.0",
            "endpoints": {
                "player": "/api/player/<tag>",
                "player_battlelog": "/api/player/<tag>/battlelog",
                "club": "/api/clubs/<tag>",
                "club_members": "/api/clubs/<tag>/members",
                "brawlers": "/api/brawlers",
                "brawler": "/api/brawlers/<id>",
                "player_rankings": "/api/rankings/players",
                "club_rankings": "/api/rankings/clubs",
                "brawler_rankings": "/api/rankings/brawlers/<id>",
                "events": "/api/events/rotation",
                "search_players": "/api/search/players?name=<name>",
                "search_clubs": "/api/search/clubs?name=<name>",
                "health": "/api/health"
            }
        })

    return app
