# Quick API Reference

## Base URL
- **Codespaces**: `https://$CODESPACE_NAME-8000.app.github.dev/api`
- **Localhost**: `http://localhost:8000/api`

## Endpoints Overview

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| GET | `/users/:id/stats` | Get user statistics |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/activities/user/:userId` | Get all activities for user |
| GET | `/activities/user/:userId/summary` | Get 7-day activity summary |
| GET | `/activities/:id` | Get activity by ID |
| POST | `/activities` | Create new activity |
| PUT | `/activities/:id` | Update activity |
| DELETE | `/activities/:id` | Delete activity |

### Teams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams` | Get all teams |
| GET | `/teams/:id` | Get team by ID |
| POST | `/teams` | Create new team |
| POST | `/teams/:id/members` | Add member to team |
| DELETE | `/teams/:id/members` | Remove member from team |
| GET | `/teams/:id/leaderboard` | Get team leaderboard |
| PUT | `/teams/:id/stats` | Update team statistics |
| DELETE | `/teams/:id` | Delete team |

### Leaderboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leaderboard` | Get global leaderboard (all users) |
| GET | `/leaderboard/type/:type` | Get leaderboard by activity type |
| GET | `/leaderboard/user/:userId` | Get user ranking & percentile |
| GET | `/leaderboard/teams/ranking` | Get team rankings |

## Common cURL Examples

### Get All Users
```bash
curl http://localhost:8000/api/users | jq .
```

### Get All Activities (for first user)
```bash
# Get first user ID
USER_ID=$(curl -s http://localhost:8000/api/users | jq -r '.[0]._id')
# Get activities
curl http://localhost:8000/api/activities/user/$USER_ID | jq .
```

### Get Global Leaderboard
```bash
curl http://localhost:8000/api/leaderboard | jq '.[0:3]'
```

### Create New User (POST)
```bash
curl -X POST http://localhost:8000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "new@example.com",
    "password": "hashedpassword",
    "profile": {
      "firstName": "New",
      "lastName": "User"
    }
  }' | jq .
```

### Create New Activity (POST)
```bash
curl -X POST http://localhost:8000/api/activities \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID_HERE",
    "type": "running",
    "duration": 45,
    "caloriesBurned": 500,
    "intensity": "high",
    "date": "'$(date -u +%Y-%m-%dT%H:%M:%S.000Z)'"
  }' | jq .
```

## Response Format

### Success (200 OK)
```json
{
  "status": "success",
  "data": {}
}
```

### Error (400/404/500)
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Activity Types
- `running`
- `cycling`
- `swimming`
- `gym`
- `walking`
- `other`

## Intensity Levels
- `low`
- `medium`
- `high`

## Testing
```bash
# Run full test suite
npm test

# Start dev server
npm run dev

# Seed database
npm run seed

# Build for production
npm run build

# Start production server
npm start
```
