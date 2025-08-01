



from flask import Blueprint, jsonify, request
import requests
import os
from dotenv import load_dotenv
from .utils import validate_tag, format_tag_for_api, format_response_data, calculate_win_rate, get_recent_performance

api = Blueprint('api', __name__)

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
BRAWL_API_TOKEN = os.environ.get('BRAWL_API_TOKEN')

BASE_URL = "https://api.brawlstars.com/v1"

def get_headers():
    """Get authorization headers for Brawl Stars API"""
    if not BRAWL_API_TOKEN:
        return None
    return {
        "Authorization": BRAWL_API_TOKEN if BRAWL_API_TOKEN.startswith('Bearer') else f"Bearer {BRAWL_API_TOKEN}"
    }

def make_api_request(endpoint):
    """Make a request to the Brawl Stars API"""
    headers = get_headers()
    if not headers:
        return {"error": "API token not set"}, 500
    
    url = f"{BASE_URL}{endpoint}"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        return format_response_data(response.json()), 200
    except requests.exceptions.HTTPError as err:
        return {
            "error": "API request failed",
            "message": str(err),
            "details": response.text if 'response' in locals() else None,
            "status_code": response.status_code if 'response' in locals() else None
        }, response.status_code if 'response' in locals() else 500
    except Exception as err:
        return {"error": "Unexpected error", "message": str(err)}, 500

@api.route('/player/<string:tag>', methods=['GET'])
def get_player(tag):
    """Get player information by tag"""
    # Validate tag
    clean_tag, error = validate_tag(tag)
    if error:
        return jsonify({"error": error}), 400
    
    formatted_tag = format_tag_for_api(clean_tag)
    data, status_code = make_api_request(f"/players/{formatted_tag}")
    return jsonify(data), status_code

@api.route('/player/<string:tag>/battlelog', methods=['GET'])
def get_player_battlelog(tag):
    """Get player's recent battles"""
    clean_tag, error = validate_tag(tag)
    if error:
        return jsonify({"error": error}), 400
    
    formatted_tag = format_tag_for_api(clean_tag)
    data, status_code = make_api_request(f"/players/{formatted_tag}/battlelog")
    return jsonify(data), status_code

@api.route('/player/<string:tag>/analytics', methods=['GET'])
def get_player_analytics(tag):
    """Get player analytics including battle stats and performance"""
    clean_tag, error = validate_tag(tag)
    if error:
        return jsonify({"error": error}), 400
    
    formatted_tag = format_tag_for_api(clean_tag)
    
    # Get player data
    player_data, player_status = make_api_request(f"/players/{formatted_tag}")
    if player_status != 200:
        return jsonify(player_data), player_status
    
    # Get battle log
    battle_data, battle_status = make_api_request(f"/players/{formatted_tag}/battlelog")
    if battle_status != 200:
        battle_data = {"items": []}  # Continue without battle data
    
    # Calculate analytics
    battles = battle_data.get('items', [])
    analytics = {
        "player_info": {
            "name": player_data.get('name'),
            "tag": player_data.get('tag'),
            "trophies": player_data.get('trophies'),
            "highest_trophies": player_data.get('highestTrophies'),
            "exp_level": player_data.get('expLevel'),
            "3vs3_victories": player_data.get('3vs3Victories'),
            "solo_victories": player_data.get('soloVictories'),
            "duo_victories": player_data.get('duoVictories')
        },
        "recent_performance": get_recent_performance(battles),
        "battle_stats": {
            "total_battles_analyzed": len(battles),
            "win_rate": calculate_win_rate(battles)
        },
        "brawler_count": len(player_data.get('brawlers', [])),
        "club_info": player_data.get('club', {})
    }
    
    return jsonify(analytics), 200

@api.route('/clubs/<string:tag>', methods=['GET'])
def get_club(tag):
    """Get club information by tag"""
    clean_tag, error = validate_tag(tag)
    if error:
        return jsonify({"error": error}), 400
    
    formatted_tag = format_tag_for_api(clean_tag)
    data, status_code = make_api_request(f"/clubs/{formatted_tag}")
    return jsonify(data), status_code

@api.route('/clubs/<string:tag>/members', methods=['GET'])
def get_club_members(tag):
    """Get club members"""
    clean_tag, error = validate_tag(tag)
    if error:
        return jsonify({"error": error}), 400
    
    formatted_tag = format_tag_for_api(clean_tag)
    data, status_code = make_api_request(f"/clubs/{formatted_tag}/members")
    return jsonify(data), status_code

@api.route('/brawlers', methods=['GET'])
def get_brawlers():
    """Get list of all brawlers"""
    data, status_code = make_api_request("/brawlers")
    return jsonify(data), status_code

@api.route('/brawlers/<int:brawler_id>', methods=['GET'])
def get_brawler(brawler_id):
    """Get specific brawler information"""
    data, status_code = make_api_request(f"/brawlers/{brawler_id}")
    return jsonify(data), status_code

@api.route('/rankings/players', methods=['GET'])
def get_player_rankings():
    """Get global player rankings"""
    country_code = request.args.get('countryCode', '')
    endpoint = f"/rankings/players"
    if country_code:
        endpoint += f"?countryCode={country_code}"
    data, status_code = make_api_request(endpoint)
    return jsonify(data), status_code

@api.route('/rankings/clubs', methods=['GET'])
def get_club_rankings():
    """Get global club rankings"""
    country_code = request.args.get('countryCode', '')
    endpoint = f"/rankings/clubs"
    if country_code:
        endpoint += f"?countryCode={country_code}"
    data, status_code = make_api_request(endpoint)
    return jsonify(data), status_code

@api.route('/rankings/brawlers/<int:brawler_id>', methods=['GET'])
def get_brawler_rankings(brawler_id):
    """Get brawler rankings"""
    country_code = request.args.get('countryCode', '')
    endpoint = f"/rankings/brawlers/{brawler_id}"
    if country_code:
        endpoint += f"?countryCode={country_code}"
    data, status_code = make_api_request(endpoint)
    return jsonify(data), status_code

@api.route('/events/rotation', methods=['GET'])
def get_events():
    """Get current event rotation"""
    data, status_code = make_api_request("/events/rotation")
    return jsonify(data), status_code

@api.route('/search/players', methods=['GET'])
def search_players():
    """Search for players by name"""
    name = request.args.get('name')
    limit = request.args.get('limit', 10)
    
    if not name:
        return jsonify({"error": "Name parameter is required"}), 400
    
    endpoint = f"/players?name={name}&limit={limit}"
    data, status_code = make_api_request(endpoint)
    return jsonify(data), status_code

@api.route('/search/clubs', methods=['GET'])
def search_clubs():
    """Search for clubs by name"""
    name = request.args.get('name')
    limit = request.args.get('limit', 10)
    
    if not name:
        return jsonify({"error": "Name parameter is required"}), 400
    
    endpoint = f"/clubs?name={name}&limit={limit}"
    data, status_code = make_api_request(endpoint)
    return jsonify(data), status_code

@api.route('/player/<string:tag>/compare/<string:compare_tag>', methods=['GET'])
def compare_players(tag, compare_tag):
    """Compare two players"""
    # Validate both tags
    clean_tag1, error1 = validate_tag(tag)
    clean_tag2, error2 = validate_tag(compare_tag)
    
    if error1:
        return jsonify({"error": f"Player 1 tag error: {error1}"}), 400
    if error2:
        return jsonify({"error": f"Player 2 tag error: {error2}"}), 400
    
    # Get both players' data
    formatted_tag1 = format_tag_for_api(clean_tag1)
    formatted_tag2 = format_tag_for_api(clean_tag2)
    
    player1_data, status1 = make_api_request(f"/players/{formatted_tag1}")
    player2_data, status2 = make_api_request(f"/players/{formatted_tag2}")
    
    if status1 != 200:
        return jsonify({"error": "Failed to fetch player 1 data", "details": player1_data}), status1
    if status2 != 200:
        return jsonify({"error": "Failed to fetch player 2 data", "details": player2_data}), status2
    
    comparison = {
        "player1": {
            "name": player1_data.get('name'),
            "tag": player1_data.get('tag'),
            "trophies": player1_data.get('trophies'),
            "highest_trophies": player1_data.get('highestTrophies'),
            "exp_level": player1_data.get('expLevel'),
            "brawler_count": len(player1_data.get('brawlers', [])),
            "3vs3_victories": player1_data.get('3vs3Victories', 0),
            "solo_victories": player1_data.get('soloVictories', 0),
            "duo_victories": player1_data.get('duoVictories', 0)
        },
        "player2": {
            "name": player2_data.get('name'),
            "tag": player2_data.get('tag'),
            "trophies": player2_data.get('trophies'),
            "highest_trophies": player2_data.get('highestTrophies'),
            "exp_level": player2_data.get('expLevel'),
            "brawler_count": len(player2_data.get('brawlers', [])),
            "3vs3_victories": player2_data.get('3vs3Victories', 0),
            "solo_victories": player2_data.get('soloVictories', 0),
            "duo_victories": player2_data.get('duoVictories', 0)
        }
    }
    
    # Add comparison metrics
    comparison["comparison"] = {
        "trophy_difference": comparison["player1"]["trophies"] - comparison["player2"]["trophies"],
        "level_difference": comparison["player1"]["exp_level"] - comparison["player2"]["exp_level"],
        "brawler_difference": comparison["player1"]["brawler_count"] - comparison["player2"]["brawler_count"],
        "higher_trophies": comparison["player1"]["name"] if comparison["player1"]["trophies"] > comparison["player2"]["trophies"] else comparison["player2"]["name"],
        "higher_level": comparison["player1"]["name"] if comparison["player1"]["exp_level"] > comparison["player2"]["exp_level"] else comparison["player2"]["name"]
    }
    
    return jsonify(comparison), 200

@api.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "api_token_configured": bool(BRAWL_API_TOKEN),
        "timestamp": "2025-08-01",
        "version": "1.0.0"
    }), 200
