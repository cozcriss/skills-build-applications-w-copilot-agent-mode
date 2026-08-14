import { Request, Response } from 'express';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Activity } from '../models/Activity.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all teams
export const getAllTeams = async (req: Request, res: Response) => {
  const teams = await Team.find().populate('leader', '-password').populate('members', '-password');
  res.json(teams);
};

// Get team by ID
export const getTeamById = async (req: Request, res: Response) => {
  const team = await Team.findById(req.params.id)
    .populate('leader', '-password')
    .populate('members', '-password');

  if (!team) {
    throw new AppError(404, 'Team not found');
  }

  res.json(team);
};

// Create team
export const createTeam = async (req: Request, res: Response) => {
  const { name, description, leader } = req.body;

  const leaderExists = await User.findById(leader);
  if (!leaderExists) {
    throw new AppError(404, 'Leader not found');
  }

  const team = new Team({
    name,
    description,
    leader,
    members: [leader],
  });

  await team.save();

  // Update user's team
  leaderExists.team = team._id;
  await leaderExists.save();

  res.status(201).json(team);
};

// Add member to team
export const addMember = async (req: Request, res: Response) => {
  const { memberId } = req.body;
  const { id: teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError(404, 'Team not found');
  }

  const member = await User.findById(memberId);
  if (!member) {
    throw new AppError(404, 'Member not found');
  }

  if (team.members.includes(memberId)) {
    throw new AppError(400, 'Member already in team');
  }

  team.members.push(memberId);
  await team.save();

  member.team = team._id;
  await member.save();

  res.json(team);
};

// Remove member from team
export const removeMember = async (req: Request, res: Response) => {
  const { memberId } = req.body;
  const { id: teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError(404, 'Team not found');
  }

  team.members = team.members.filter((m) => m.toString() !== memberId);
  await team.save();

  const member = await User.findById(memberId);
  if (member) {
    member.team = undefined;
    await member.save();
  }

  res.json(team);
};

// Get team leaderboard
export const getTeamLeaderboard = async (req: Request, res: Response) => {
  const { id: teamId } = req.params;

  const team = await Team.findById(teamId).populate('members');
  if (!team) {
    throw new AppError(404, 'Team not found');
  }

  const leaderboard = await Promise.all(
    team.members.map(async (member: any) => {
      const activities = await Activity.find({ userId: member._id });
      return {
        userId: member._id,
        username: member.username,
        totalActivities: activities.length,
        totalDuration: activities.reduce((sum, a) => sum + a.duration, 0),
        totalCalories: activities.reduce((sum, a) => sum + a.caloriesBurned, 0),
      };
    })
  );

  // Sort by total calories descending
  leaderboard.sort((a, b) => b.totalCalories - a.totalCalories);

  res.json(leaderboard);
};

// Update team stats
export const updateTeamStats = async (req: Request, res: Response) => {
  const { id: teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError(404, 'Team not found');
  }

  const activities = await Activity.find({ userId: { $in: team.members } });

  team.stats.totalActivities = activities.length;
  team.stats.totalDuration = activities.reduce((sum, a) => sum + a.duration, 0);
  team.stats.totalCalories = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);

  await team.save();
  res.json(team);
};

// Delete team
export const deleteTeam = async (req: Request, res: Response) => {
  const team = await Team.findByIdAndDelete(req.params.id);

  if (!team) {
    throw new AppError(404, 'Team not found');
  }

  // Remove team reference from users
  await User.updateMany({ team: team._id }, { team: undefined });

  res.json({ message: 'Team deleted', team });
};
