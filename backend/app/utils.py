import os
import requests

BASE_URL = "https://api.brawlstars.com/v1"

def get_player_data(player_tag):
    url = f"{BASE_URL}/players/%23{player_tag.strip('#')}"  # # replaced with %23
    headers = {
        "Authorization": os.getenv("BRAWL_API_TOKEN")
    }
    response = requests.get(url, headers=headers)
    return response.json()
