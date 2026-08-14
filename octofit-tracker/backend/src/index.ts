import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import { getServerUrl, getEnvironmentInfo } from './config/environment.js';
import userRoutes from './routes/users.js';
import activityRoutes from './routes/activities.js';
import teamRoutes from './routes/teams.js';
import leaderboardRoutes from './routes/leaderboard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: getEnvironmentInfo(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  const serverUrl = getServerUrl();
  const env = getEnvironmentInfo();
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   OctoFit Tracker API Started          ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`\n🌐 Server URL: ${serverUrl}`);
  console.log(`📍 Environment: ${env.env}`);
  console.log(`🗄️  Database: ${env.mongoUri.split('/').pop()}`);
  console.log(`🔌 Port: ${env.port}`);
  
  if (env.codespace !== 'local') {
    console.log(`☁️  Codespace: ${env.codespace}`);
    console.log(`🌍 Codespaces URL: ${serverUrl}`);
  }
  
  console.log(`\n📚 API Documentation:`);
  console.log(`   Health: ${serverUrl}/api/health`);
  console.log(`   Users: ${serverUrl}/api/users`);
  console.log(`   Activities: ${serverUrl}/api/activities`);
  console.log(`   Teams: ${serverUrl}/api/teams`);
  console.log(`   Leaderboard: ${serverUrl}/api/leaderboard\n`);
});
