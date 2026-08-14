# OctoFit Tracker API Configuration Guide

## Environment Support

The OctoFit Tracker backend automatically detects and configures the API for both **GitHub Codespaces** and **localhost** deployment.

### Automatic Detection

The server reads the `CODESPACE_NAME` environment variable to determine the deployment environment:

- **Codespaces Detected**: API URL = `https://$CODESPACE_NAME-8000.app.github.dev`
- **Localhost**: API URL = `http://localhost:8000`

## Configuration

### Environment Variables

Create a `.env` file in the `octofit-tracker/backend/` directory:

```bash
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit_db
NODE_ENV=development
# CODESPACE_NAME is automatically set in GitHub Codespaces
```

See `.env.example` for the template.

## Running the Server

### Development Server (with auto-reload)

```bash
npm run dev
```

Output will show:
```
╔════════════════════════════════════════╗
║   OctoFit Tracker API Started          ║
╚════════════════════════════════════════╝

🌐 Server URL: https://[codespace-name]-8000.app.github.dev
📍 Environment: development
🗄️  Database: octofit_db
🔌 Port: 8000

📚 API Documentation:
   Health: https://[codespace-name]-8000.app.github.dev/api/health
   Users: https://[codespace-name]-8000.app.github.dev/api/users
   Activities: https://[codespace-name]-8000.app.github.dev/api/activities
   Teams: https://[codespace-name]-8000.app.github.dev/api/teams
   Leaderboard: https://[codespace-name]-8000.app.github.dev/api/leaderboard
```

### Production Server (compiled)

```bash
npm run build
npm start
```

## API Testing

### Run Full Test Suite

```bash
npm test
```

This runs `test-api.sh` which tests:
- ✓ Health check endpoint
- ✓ Get all users
- ✓ Get user by ID
- ✓ Get user stats
- ✓ Get user activities
- ✓ Get 7-day activity summary
- ✓ Get all teams
- ✓ Get global leaderboard
- ✓ Get user ranking

### Manual Testing with curl

#### Test Health Check
```bash
curl http://localhost:8000/api/health | jq .
```

#### Get All Users
```bash
curl http://localhost:8000/api/users | jq '.[] | {username, email, stats}'
```

#### Get Specific User
```bash
USER_ID="your-user-id-here"
curl http://localhost:8000/api/users/$USER_ID | jq .
```

#### Get User Activities
```bash
USER_ID="your-user-id-here"
curl http://localhost:8000/api/activities/user/$USER_ID | jq '.[] | {type, duration, caloriesBurned, intensity}'
```

#### Get Activity Summary (Last 7 Days)
```bash
USER_ID="your-user-id-here"
curl http://localhost:8000/api/activities/user/$USER_ID/summary | jq .
```

#### Get All Teams
```bash
curl http://localhost:8000/api/teams | jq '.[] | {name, members: (.members | length), totalActivities: .stats.totalActivities}'
```

#### Get Global Leaderboard
```bash
curl http://localhost:8000/api/leaderboard | jq '.[] | {username, caloriesBurned: .stats.caloriesBurned}'
```

#### Get User Ranking
```bash
USER_ID="your-user-id-here"
curl http://localhost:8000/api/leaderboard/user/$USER_ID | jq .
```

## Accessing from Frontend

### In Codespaces
Use the public Codespaces URL:
```javascript
const API_BASE = 'https://' + process.env.CODESPACE_NAME + '-8000.app.github.dev/api';
```

### In Localhost
```javascript
const API_BASE = 'http://localhost:8000/api';
```

### Smart Configuration
```javascript
const getApiBase = () => {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000/api';
  }
  // Codespaces environment
  return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
};
```

## Port Forwarding

Ports configured in `.devcontainer/devcontainer.json`:
- **5173**: React Frontend (Vite)
- **8000**: Node.js API (Express)
- **27017**: MongoDB Database

These are automatically forwarded in Codespaces and available locally.

## Database Initialization

Populate the database with seed data:

```bash
npm run seed
```

This creates:
- 6 sample users with profiles
- 3 teams with members
- 48 activities across users

## Troubleshooting

### Connection Refused
Ensure MongoDB is running:
```bash
ps aux | grep mongod
```

If not running, MongoDB may start automatically based on `.devcontainer/post_start.sh`.

### Port Already in Use
If port 8000 is in use, specify a different port:
```bash
PORT=8001 npm run dev
```

### API Returns 404
Verify the endpoint path:
- ✓ `/api/health`
- ✓ `/api/users`
- ✓ `/api/activities`
- ✓ `/api/teams`
- ✓ `/api/leaderboard`

### CORS Issues
CORS is enabled for all origins in development. For production, update:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

## Architecture

```
Backend (Express.js - Port 8000)
├── Models (Mongoose)
│   ├── User
│   ├── Activity
│   └── Team
├── Controllers
│   ├── userController
│   ├── activityController
│   ├── teamController
│   └── leaderboardController
├── Routes
│   ├── /api/users
│   ├── /api/activities
│   ├── /api/teams
│   └── /api/leaderboard
├── Middleware
│   └── Error handling & async wrapper
└── Database (MongoDB - Port 27017)
    └── octofit_db
```

## Environment Info Endpoint

The `/api/health` endpoint returns environment information:

```json
{
  "status": "OK",
  "timestamp": "2026-08-14T11:38:12.941Z",
  "environment": {
    "env": "development",
    "codespace": "super-duper-space-capybara-g44xxj9rqx53ppq6",
    "port": "8000",
    "mongoUri": "mongodb://localhost:27017/octofit_db"
  }
}
```

This helps verify the correct environment and configuration is active.
