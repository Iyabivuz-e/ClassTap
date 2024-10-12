import mongoose, { Schema, Document } from "mongoose";

interface IDirector extends Document {
  fullname: string;
  email: string;
  password: string;
  schoolName: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

const directorSchema: Schema = new Schema(
  {
    fullname: { type: "string", required: true },
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    schoolName: { type: "string", required: true },
    role: { type: "string", default: "Director" },
  },
  { timestamps: true }
);

export default mongoose.models.Directors ||
  mongoose.model<IDirector>("Directors", directorSchema);
