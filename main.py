import requests
from config import API_TOKEN

def get_player_data(tag):
    headers = {
        "Authorization": f"Bearer {API_TOKEN}"
    }
    url = f"https://api.brawlstars.com/v1/players/{tag.replace('#', '%23')}"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        print("Error:", response.status_code, response.text)
        return None

if __name__ == "__main__":
    player_tag = input("Enter Brawl Stars player tag (example: #9LUU9RR): ")
    data = get_player_data(player_tag)
    if data:
        print("Name:", data['name'])
        print("Trophies:", data['trophies'])
