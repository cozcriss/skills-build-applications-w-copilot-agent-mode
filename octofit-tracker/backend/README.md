# OctoFit Tracker Backend API

Express.js-based REST API for the OctoFit Tracker application.

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Configuration

Create a `.env` file based on `.env.example`:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/octofit_db
NODE_ENV=development
```

### Start Development Server

```bash
npm run dev
```

The API will run on `http://localhost:8000`

## API Endpoints

### Health Check

- **GET** `/api/health` - Check API status

### Users

- **GET** `/api/users` - Get all users
- **GET** `/api/users/:id` - Get user by ID
- **POST** `/api/users` - Create new user
- **PUT** `/api/users/:id` - Update user profile
- **DELETE** `/api/users/:id` - Delete user
- **GET** `/api/users/:id/stats` - Get user activity statistics

### Activities

- **GET** `/api/activities/user/:userId` - Get all activities for a user
- **GET** `/api/activities/user/:userId/summary` - Get activity summary (last 7 days)
- **GET** `/api/activities/:id` - Get activity by ID
- **POST** `/api/activities` - Create new activity
- **PUT** `/api/activities/:id` - Update activity
- **DELETE** `/api/activities/:id` - Delete activity

### Teams

- **GET** `/api/teams` - Get all teams
- **GET** `/api/teams/:id` - Get team by ID
- **POST** `/api/teams` - Create new team
- **POST** `/api/teams/:id/members` - Add member to team
- **DELETE** `/api/teams/:id/members` - Remove member from team
- **GET** `/api/teams/:id/leaderboard` - Get team leaderboard
- **PUT** `/api/teams/:id/stats` - Update team statistics
- **DELETE** `/api/teams/:id` - Delete team

### Leaderboard

- **GET** `/api/leaderboard` - Get global leaderboard (all users)
- **GET** `/api/leaderboard/type/:type` - Get leaderboard for activity type
- **GET** `/api/leaderboard/user/:userId` - Get user ranking and percentile
- **GET** `/api/leaderboard/teams/ranking` - Get team rankings

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main application entry point
│   ├── config/
│   │   └── database.ts       # MongoDB connection configuration
│   ├── models/
│   │   ├── User.ts           # User data model
│   │   ├── Activity.ts       # Activity data model
│   │   └── Team.ts           # Team data model
│   ├── controllers/
│   │   ├── userController.ts         # User business logic
│   │   ├── activityController.ts     # Activity business logic
│   │   ├── teamController.ts         # Team business logic
│   │   └── leaderboardController.ts  # Leaderboard logic
│   ├── routes/
│   │   ├── users.ts          # User endpoints
│   │   ├── activities.ts     # Activity endpoints
│   │   ├── teams.ts          # Team endpoints
│   │   └── leaderboard.ts    # Leaderboard endpoints
│   └── middleware/
│       └── errorHandler.ts   # Error handling & async wrapper
├── package.json
├── tsconfig.json
└── .env.example
```

## Data Models

### User

```typescript
{
  username: string (unique)
  email: string (unique)
  password: string
  profile: {
    firstName: string
    lastName: string
    avatar?: string
    bio?: string
  }
  stats: {
    totalActivities: number
    totalDuration: number (minutes)
    caloriesBurned: number
  }
  team?: ObjectId (Team reference)
  createdAt: Date
  updatedAt: Date
}
```

### Activity

```typescript
{
  userId: ObjectId (User reference, required)
  type: 'running' | 'cycling' | 'swimming' | 'gym' | 'walking' | 'other'
  duration: number (minutes, required)
  distance?: number (kilometers)
  caloriesBurned: number (required)
  intensity: 'low' | 'medium' | 'high'
  notes?: string
  date: Date (required)
  createdAt: Date
  updatedAt: Date
}
```

### Team

```typescript
{
  name: string (unique)
  description?: string
  leader: ObjectId (User reference, required)
  members: ObjectId[] (User references)
  stats: {
    totalActivities: number
    totalDuration: number
    totalCalories: number
  }
  createdAt: Date
  updatedAt: Date
}
```

## Error Handling

The API uses a centralized error handler with consistent error responses:

```json
{
  "error": "Error message",
  "statusCode": 400
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Build & Deployment

### Build TypeScript

```bash
npm run build
```

This compiles TypeScript files to JavaScript in the `dist/` directory.

### Production Start

```bash
npm start
```

Runs the compiled JavaScript from `dist/index.js`

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **tsx** - TypeScript execution for development
