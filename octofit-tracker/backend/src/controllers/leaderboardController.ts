import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { Team } from '../models/Team.js';

// Get global leaderboard (top users by calories burned)
export const getGlobalLeaderboard = async (req: Request, res: Response) => {
  const users = await User.find().select('-password').sort({
    'stats.caloriesBurned': -1,
  });

  const leaderboard = await Promise.all(
    users.map(async (user) => {
      const activities = await Activity.find({ userId: user._id });
      return {
        userId: user._id,
        username: user.username,
        profile: user.profile,
        stats: user.stats,
        recentActivities: activities.slice(0, 5),
      };
    })
  );

  res.json(leaderboard);
};

// Get leaderboard by activity type
export const getLeaderboardByType = async (req: Request, res: Response) => {
  const { type } = req.params;

  const activities = await Activity.find({ type }).populate('userId', '-password');

  const userStats: Record<string, any> = {};

  activities.forEach((activity) => {
    const userObj = activity.userId as any;
    const userId = userObj._id.toString();
    if (!userStats[userId]) {
      userStats[userId] = {
        userId: userObj._id,
        username: userObj.username,
        count: 0,
        totalDuration: 0,
        totalCalories: 0,
      };
    }
    userStats[userId].count += 1;
    userStats[userId].totalDuration += activity.duration;
    userStats[userId].totalCalories += activity.caloriesBurned;
  });

  const leaderboard = Object.values(userStats).sort(
    (a, b) => b.totalCalories - a.totalCalories
  );

  res.json(leaderboard);
};

// Get user rank
export const getUserRank = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const allUsers = await User.find().select('stats').sort({
    'stats.caloriesBurned': -1,
  });

  const rank = allUsers.findIndex((u) => u._id.toString() === userId) + 1;

  res.json({
    userId,
    rank,
    totalUsers: allUsers.length,
    percentile: ((rank / allUsers.length) * 100).toFixed(2),
  });
};

// Get team leaderboard ranking
export const getTeamRanking = async (req: Request, res: Response) => {
  const teams = await Team.find();

  const teamStats = await Promise.all(
    teams.map(async (team) => {
      const activities = await Activity.find({ userId: { $in: team.members } });
      return {
        teamId: team._id,
        name: team.name,
        totalActivities: activities.length,
        totalDuration: activities.reduce((sum, a) => sum + a.duration, 0),
        totalCalories: activities.reduce((sum, a) => sum + a.caloriesBurned, 0),
        memberCount: team.members.length,
      };
    })
  );

  const ranking = teamStats.sort((a, b) => b.totalCalories - a.totalCalories);

  res.json(ranking);
};
