import mongoose, { Schema, Document, Types } from "mongoose";

export interface IClass extends Document {
  class_name: string; // Class name, e.g., "Level 3"
  teacher: string;
  course: string; // Course name, e.g., "Software"
  students: Types.ObjectId[]; // Array of Student ObjectIds
}

const classSchema: Schema = new Schema(
  {
    class_name: { type: String, required: true }, // Class name like "Level 3"
    teacher: { type: String, required: true },
    course: { type: String, required: true }, // Course like "Software"
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }], // References to Students
  },
  { timestamps: true }
);

export default mongoose.models.Class ||
  mongoose.model<IClass>("Class", classSchema);
