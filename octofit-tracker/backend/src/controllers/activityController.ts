import { Request, Response } from 'express';
import { Activity } from '../models/Activity.js';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all activities for a user
export const getUserActivities = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const activities = await Activity.find({ userId }).sort({ date: -1 });
  res.json(activities);
};

// Get activity by ID
export const getActivityById = async (req: Request, res: Response) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) {
    throw new AppError(404, 'Activity not found');
  }
  res.json(activity);
};

// Create activity
export const createActivity = async (req: Request, res: Response) => {
  const { userId, type, duration, distance, caloriesBurned, intensity, notes, date } = req.body;

  // Verify user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const activity = new Activity({
    userId,
    type,
    duration,
    distance,
    caloriesBurned,
    intensity,
    notes,
    date,
  });

  await activity.save();

  // Update user stats
  user.stats.totalActivities += 1;
  user.stats.totalDuration += duration;
  user.stats.caloriesBurned += caloriesBurned;
  await user.save();

  res.status(201).json(activity);
};

// Update activity
export const updateActivity = async (req: Request, res: Response) => {
  const { type, duration, distance, caloriesBurned, intensity, notes, date } = req.body;
  const oldActivity = await Activity.findById(req.params.id);

  if (!oldActivity) {
    throw new AppError(404, 'Activity not found');
  }

  // Update activity
  const activity = await Activity.findByIdAndUpdate(
    req.params.id,
    { type, duration, distance, caloriesBurned, intensity, notes, date },
    { new: true }
  );

  // Update user stats
  const user = await User.findById(oldActivity.userId);
  if (user) {
    user.stats.totalDuration -= oldActivity.duration;
    user.stats.totalDuration += duration;
    user.stats.caloriesBurned -= oldActivity.caloriesBurned;
    user.stats.caloriesBurned += caloriesBurned;
    await user.save();
  }

  res.json(activity);
};

// Delete activity
export const deleteActivity = async (req: Request, res: Response) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);

  if (!activity) {
    throw new AppError(404, 'Activity not found');
  }

  // Update user stats
  const user = await User.findById(activity.userId);
  if (user) {
    user.stats.totalActivities -= 1;
    user.stats.totalDuration -= activity.duration;
    user.stats.caloriesBurned -= activity.caloriesBurned;
    await user.save();
  }

  res.json({ message: 'Activity deleted', activity });
};

// Get activity summary for user (last 7 days)
export const getActivitySummary = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const activities = await Activity.find({
    userId,
    date: { $gte: sevenDaysAgo },
  });

  const summary = {
    totalActivities: activities.length,
    totalDuration: activities.reduce((sum, a) => sum + a.duration, 0),
    totalCalories: activities.reduce((sum, a) => sum + a.caloriesBurned, 0),
    byType: {} as Record<string, number>,
  };

  activities.forEach((a) => {
    summary.byType[a.type] = (summary.byType[a.type] || 0) + 1;
  });

  res.json(summary);
};
