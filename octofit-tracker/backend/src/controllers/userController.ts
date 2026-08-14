import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  res.json(user);
};

// Create user
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, profile } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    throw new AppError(400, 'Username or email already exists');
  }

  const user = new User({
    username,
    email,
    password, // In production, hash this!
    profile,
  });

  await user.save();
  res.status(201).json(user);
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const { profile, stats } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { profile, stats },
    { new: true }
  );

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  res.json(user);
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  res.json({ message: 'User deleted', user });
};

// Get user stats
export const getUserStats = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  res.json(user.stats);
};
