import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Disable ESLint rule for this file
/* eslint-disable no-invalid-this */

// Define TypeScript interface for the User model
export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    image: {
      type: String,
      default: null,
    },
    emailVerified: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  const doc = this as UserDocument;
  if (!doc.isModified('password')) return next();
  
  try {
    const hashedPassword = await bcrypt.hash(doc.password, 10);
    doc.password = hashedPassword;
    return next();
  } catch (error) {
    return next(error as Error);
  }
});

// Prevent mongoose from creating a new model if it already exists
export const User = mongoose.models.User as UserModel || mongoose.model<UserDocument, UserModel>('User', userSchema);
 