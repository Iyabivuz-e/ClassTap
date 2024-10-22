import mongoose, { Schema, Document } from "mongoose";

interface IAttendance {
  date: Date;
  status: string;
}

export interface IStudent extends Document {
  student_id: string;
  student_name: string;
  card_id: string;
  gender: string;
  class_name: string; // Store class name like "Level 3"
  enrollment_year: number;
  profile_image: string;
  active_status: boolean;
  status: string;
  attendance_status: IAttendance[];
  course: string; // New property added here
}

const studentSchema: Schema = new Schema(
  {
    student_id: { type: String, unique: true, index: true, required: true },
    student_name: { type: String, required: true },
    card_id: { type: String, unique: true, index: true, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    class_name: { type: String, required: true }, // Store the class as a string like "Level 3"
    enrollment_year: {
      type: Number,
      min: 2012,
      max: new Date().getFullYear(),
      required: true,
    },
    profile_image: { type: String },
    active_status: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["enrolled", "suspended", "graduated"],
      default: "enrolled",
    },
    attendance_status: [
      {
        date: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ["present", "late", "absent"],
          default: "absent",
        },
      },
    ],
    course: { type: String, required: true }, // New property added here
  },
  { timestamps: true }
);

const StudentModel =
  mongoose.models.Student || mongoose.model<IStudent>("Student", studentSchema);
export default StudentModel; // Keep the default export for the model
