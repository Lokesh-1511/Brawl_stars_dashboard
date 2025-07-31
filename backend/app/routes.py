



from flask import Blueprint, jsonify, request
import requests
import os
from dotenv import load_dotenv

api = Blueprint('api', __name__)

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))
BRAWL_API_TOKEN = os.environ.get('BRAWL_API_TOKEN')

@api.route('/player/<string:tag>', methods=['GET'])
def get_player(tag):
    if not BRAWL_API_TOKEN:
        return jsonify({"message": "API token not set"}), 500

    headers = {
        "Authorization": BRAWL_API_TOKEN if BRAWL_API_TOKEN.startswith('Bearer') else f"Bearer {BRAWL_API_TOKEN}"
    }

    tag = tag.upper().replace('#', '%23')  # Make sure tag is URL-safe
    url = f"https://api.brawlstars.com/v1/players/{tag}"

    try:
        res = requests.get(url, headers=headers)
        res.raise_for_status()
        return jsonify(res.json())
    except requests.exceptions.HTTPError as err:
        return jsonify({"message": "Failed to fetch player", "error": str(err), "details": res.text}), res.status_code
