import mongoose, { Schema, Document } from 'mongoose';

export interface IChild extends Document {
  name: string;
  userId: mongoose.Types.ObjectId;
  paths: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ChildSchema = new Schema<IChild>(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paths: [{ type: Schema.Types.ObjectId, ref: 'Path' }],
  },
  { timestamps: true }
);

const Child = mongoose.models.Child || mongoose.model<IChild>('Child', ChildSchema);

export { Child }; 