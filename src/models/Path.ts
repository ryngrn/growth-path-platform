import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  description: string;
  ageRange: {
    min: number;
    max: number;
  };
  scormData: {
    status: 'not attempted' | 'incomplete' | 'completed' | 'passed' | 'failed';
    score?: number;
    timeSpent: number;
    lastAttempt: Date;
  };
}

export interface IPath extends Document {
  name: string;
  description: string;
  category: string;
  skills: ISkill[];
  children: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  ageRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  scormData: {
    status: {
      type: String,
      enum: ['not attempted', 'incomplete', 'completed', 'passed', 'failed'],
      default: 'not attempted',
    },
    score: { type: Number },
    timeSpent: { type: Number, default: 0 },
    lastAttempt: { type: Date },
  },
});

const PathSchema = new Schema<IPath>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    skills: [SkillSchema],
    children: [{ type: Schema.Types.ObjectId, ref: 'Child' }],
  },
  { timestamps: true }
);

export default mongoose.models.Path || mongoose.model<IPath>('Path', PathSchema); 