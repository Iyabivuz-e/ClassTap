import mongoose, { Schema, Document } from "mongoose";

//Specifying the properties of the schema object
interface IStudent extends Document {
  student_id: string;
  student_name: string;
  card_id: string;
  gender: string;
  class_name: string;
  enrollment_year: number;
  profile_image: string;
  active_status: boolean;
}

//creating a new student schema
const studentSchema: Schema = new Schema(
  {
    student_id: { type: String, unique: true, index: true, required: true },
    student_name: { type: String, required: true },
    card_id: { type: String, unique: true, index: true, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    class_name: { type: String, required: true },
    enrollment_year: {
      type: Number,
      min: 2012,
      max: new Date().getFullYear(),
      required: true,
    },
    profile_image: { type: String },
    active_status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Student ||
  mongoose.model<IStudent>("Student", studentSchema);
