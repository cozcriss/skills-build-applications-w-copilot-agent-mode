import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description?: string;
  leader: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  stats: {
    totalActivities: number;
    totalDuration: number;
    totalCalories: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true },
    description: String,
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    stats: {
      totalActivities: { type: Number, default: 0 },
      totalDuration: { type: Number, default: 0 },
      totalCalories: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Team = mongoose.model<ITeam>('Team', teamSchema);
