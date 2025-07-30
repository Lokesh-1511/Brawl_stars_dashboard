from flask import Blueprint, jsonify, request
from .utils import get_player_data

main = Blueprint('main', __name__)

@main.route("/api/ping")
def ping():
    return jsonify({"message": "pong!"})

@main.route("/api/player/<player_tag>")
def player_info(player_tag):
    data = get_player_data(player_tag)
    return jsonify(data)
