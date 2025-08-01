# Brawl Stars Dashboard Backend

A comprehensive Flask API for fetching and analyzing Brawl Stars player and club data using the official Brawl Stars API.

## Features

- **Player Data**: Get detailed player information including stats, brawlers, and battle history
- **Club Data**: Fetch club information and member lists
- **Analytics**: Advanced player analytics including win rates and performance metrics
- **Rankings**: Access global and country-specific leaderboards
- **Search**: Find players and clubs by name
- **Events**: Get current event rotation
- **Comparison**: Compare two players side by side
- **Brawler Info**: Get information about all brawlers

## API Endpoints

### Player Endpoints
- `GET /api/player/<tag>` - Get player information
- `GET /api/player/<tag>/battlelog` - Get player's recent battles
- `GET /api/player/<tag>/analytics` - Get player analytics and performance stats
- `GET /api/player/<tag>/compare/<compare_tag>` - Compare two players

### Club Endpoints
- `GET /api/clubs/<tag>` - Get club information
- `GET /api/clubs/<tag>/members` - Get club members

### Brawler Endpoints
- `GET /api/brawlers` - Get list of all brawlers
- `GET /api/brawlers/<id>` - Get specific brawler information

### Ranking Endpoints
- `GET /api/rankings/players?countryCode=<code>` - Get player rankings
- `GET /api/rankings/clubs?countryCode=<code>` - Get club rankings
- `GET /api/rankings/brawlers/<id>?countryCode=<code>` - Get brawler rankings

### Search Endpoints
- `GET /api/search/players?name=<name>&limit=<limit>` - Search players by name
- `GET /api/search/clubs?name=<name>&limit=<limit>` - Search clubs by name

### Other Endpoints
- `GET /api/events/rotation` - Get current event rotation
- `GET /api/health` - Health check endpoint
- `GET /` - API documentation and endpoint list

## Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Create a `.env` file in the backend directory:
   ```
   BRAWL_API_TOKEN=Bearer your_token_here
   FLASK_ENV=development
   ```

3. **Get Brawl Stars API Token**
   - Visit [Brawl Stars Developer Portal](https://developer.brawlstars.com)
   - Create an account and generate an API token
   - Add your public IP address to the whitelist

4. **Run the Server**
   ```bash
   python app.py
   ```
   
   The server will start on `http://127.0.0.1:5000`

## Environment Configuration

### Required Environment Variables
- `BRAWL_API_TOKEN`: Your Brawl Stars API token (with or without "Bearer " prefix)

### Optional Environment Variables
- `FLASK_ENV`: Set to "development" for debug mode

## API Usage Examples

### Get Player Information
```bash
curl "http://127.0.0.1:5000/api/player/8VJ8PQLQP"
```

### Get Player Analytics
```bash
curl "http://127.0.0.1:5000/api/player/8VJ8PQLQP/analytics"
```

### Search for Players
```bash
curl "http://127.0.0.1:5000/api/search/players?name=PlayerName&limit=5"
```

### Get Global Player Rankings
```bash
curl "http://127.0.0.1:5000/api/rankings/players"
```

### Get Country-Specific Rankings
```bash
curl "http://127.0.0.1:5000/api/rankings/players?countryCode=US"
```

## Response Format

All API responses follow this format:
```json
{
  "data": "response_data",
  "_timestamp": "2025-08-01T12:00:00.000Z"
}
```

Error responses:
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "details": "Additional error details (if available)"
}
```

## Features

### Tag Validation
- Automatically validates and formats Brawl Stars tags
- Supports tags with or without the `#` prefix
- Validates tag format and length

### Error Handling
- Comprehensive error handling for API requests
- Detailed error messages for debugging
- Proper HTTP status codes

### CORS Support
- Configured for frontend development
- Supports multiple localhost ports (3000, 5173)

### Analytics
- Win rate calculations
- Recent performance statistics
- Most played modes and brawlers
- Player comparison metrics

## Project Structure

```
backend/
├── app/
│   ├── __init__.py          # Flask app factory
│   ├── routes.py            # API endpoints
│   └── utils.py             # Utility functions
├── app.py                   # Application entry point
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── README.md               # This file
```

## Development

### Adding New Endpoints
1. Add the endpoint function to `app/routes.py`
2. Use the `make_api_request()` helper for Brawl Stars API calls
3. Validate input parameters using utility functions
4. Return JSON responses with proper status codes

### Testing
Test the API endpoints using curl, Postman, or your frontend application.

### Deployment
For production deployment:
1. Set `FLASK_ENV=production`
2. Use a production WSGI server like Gunicorn
3. Configure proper CORS origins for your domain
4. Ensure your server's IP is whitelisted in the Brawl Stars API

## Dependencies

- Flask: Web framework
- Flask-CORS: CORS support
- python-dotenv: Environment variable management
- requests: HTTP requests to Brawl Stars API

## License

This project is for educational purposes. Please respect the Brawl Stars API terms of service.
