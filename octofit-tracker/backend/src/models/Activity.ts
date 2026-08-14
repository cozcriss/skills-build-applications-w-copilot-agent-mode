import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'running' | 'cycling' | 'swimming' | 'gym' | 'walking' | 'other';
  duration: number;
  distance?: number;
  caloriesBurned: number;
  intensity: 'low' | 'medium' | 'high';
  notes?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['running', 'cycling', 'swimming', 'gym', 'walking', 'other'],
      required: true,
    },
    duration: { type: Number, required: true }, // in minutes
    distance: Number, // in kilometers
    caloriesBurned: { type: Number, required: true },
    intensity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
    },
    notes: String,
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
