import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };
  stats: {
    totalActivities: number;
    totalDuration: number;
    caloriesBurned: number;
  };
  team?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatar: String,
      bio: String,
    },
    stats: {
      totalActivities: { type: Number, default: 0 },
      totalDuration: { type: Number, default: 0 },
      caloriesBurned: { type: Number, default: 0 },
    },
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
