import re
import os
import requests
from datetime import datetime

BASE_URL = "https://api.brawlstars.com/v1"

def get_player_data(player_tag):
    url = f"{BASE_URL}/players/%23{player_tag.strip('#')}"  # # replaced with %23
    headers = {
        "Authorization": os.getenv("BRAWL_API_TOKEN")
    }
    response = requests.get(url, headers=headers)
    return response.json()

def validate_tag(tag):
    """Validate and format a Brawl Stars tag"""
    if not tag:
        return None, "Tag is required"
    
    # Remove # if present and convert to uppercase
    clean_tag = tag.replace('#', '').upper()
    
    # Check if tag contains only valid characters (letters and numbers)
    if not re.match(r'^[A-Z0-9]+$', clean_tag):
        return None, "Tag can only contain letters and numbers"
    
    # Check length (typical Brawl Stars tags are 8-9 characters)
    if len(clean_tag) < 3 or len(clean_tag) > 15:
        return None, "Tag length must be between 3 and 15 characters"
    
    return clean_tag, None

def format_tag_for_api(tag):
    """Format tag for API request (URL encode #)"""
    return f"%23{tag}"

def format_response_data(data):
    """Format API response data for better frontend consumption"""
    if isinstance(data, dict):
        # Add timestamp to response
        data['_timestamp'] = datetime.utcnow().isoformat()
        
        # Format player data if present
        if 'tag' in data and 'name' in data:
            data['formattedTag'] = f"#{data['tag'].replace('%23', '')}"
        
        # Format trophy data
        if 'trophies' in data:
            data['trophyFormatted'] = f"{data['trophies']:,}"
    
    return data

def calculate_win_rate(battles):
    """Calculate win rate from battle log"""
    if not battles or not isinstance(battles, list):
        return 0
    
    wins = sum(1 for battle in battles if battle.get('battle', {}).get('result') == 'victory')
    total = len(battles)
    
    return round((wins / total) * 100, 2) if total > 0 else 0

def get_recent_performance(battles, days=7):
    """Get recent performance statistics"""
    if not battles:
        return {}
    
    recent_battles = battles[:min(len(battles), 25)]  # Last 25 battles
    
    performance = {
        'total_battles': len(recent_battles),
        'wins': 0,
        'losses': 0,
        'draws': 0,
        'win_rate': 0,
        'most_played_mode': None,
        'most_played_brawler': None
    }
    
    modes = {}
    brawlers = {}
    
    for battle in recent_battles:
        result = battle.get('battle', {}).get('result', 'unknown')
        
        if result == 'victory':
            performance['wins'] += 1
        elif result == 'defeat':
            performance['losses'] += 1
        else:
            performance['draws'] += 1
        
        # Count modes
        mode = battle.get('battle', {}).get('mode', 'unknown')
        modes[mode] = modes.get(mode, 0) + 1
        
        # Count brawlers
        brawler = battle.get('battle', {}).get('starPlayer', {}).get('brawler', {}).get('name', 'unknown')
        brawlers[brawler] = brawlers.get(brawler, 0) + 1
    
    # Calculate win rate
    if performance['total_battles'] > 0:
        performance['win_rate'] = round((performance['wins'] / performance['total_battles']) * 100, 2)
    
    # Most played mode and brawler
    if modes:
        performance['most_played_mode'] = max(modes, key=modes.get)
    if brawlers:
        performance['most_played_brawler'] = max(brawlers, key=brawlers.get)
    
    return performance
