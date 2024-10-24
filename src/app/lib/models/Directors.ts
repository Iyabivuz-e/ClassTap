import mongoose, { Schema, Document } from "mongoose";

interface IDirector extends Document {
  fullname: string;
  email: string;
  password: string;
  schoolName: string;
  role?: string;
  status?: string;
  phoneNumber?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  profilePicture?: string;
  lastLogin?: Date;
  permissions?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const directorSchema: Schema = new Schema(
  {
    fullname: { type: "string", required: true },
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    schoolName: { type: "string", required: true },
    role: { type: "string", default: "Director of Studies" },
    status: { type: "string", enum: ["active", "inactive"], default: "active" },
    phoneNumber: { type: "string", required: false },
    resetToken: { type: "string", required: false },
    resetTokenExpiry: { type: "Date", required: false },
    address: {
      street: { type: "string", required: false },
      city: { type: "string", required: false },
      state: { type: "string", required: false },
      postalCode: { type: "string", required: false },
    },
    profilePicture: { type: "string", required: false },
    lastLogin: { type: "Date", required: false },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Directors ||
  mongoose.model<IDirector>("Directors", directorSchema);
