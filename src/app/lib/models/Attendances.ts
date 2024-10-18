import mongoose, { Schema, Document, Types } from "mongoose";

// Specifying the properties of the schema object
interface IAttendance extends Document {
  studentId: Types.ObjectId; // Reference to Student
  timestamp: Date;
  status?: string;
}

const AttendanceSchema: Schema<IAttendance> = new Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  }, // Reference to Student schema
  timestamp: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    default: "absent",
    enum: ["present", "late", "absent"],
  },
});

// Ensure studentId and timestamp are unique (for the same day)
AttendanceSchema.index({ studentId: 1, timestamp: 1 }, { unique: true });

export default mongoose.models.Attendances ||
  mongoose.model<IAttendance>("Attendances", AttendanceSchema);
