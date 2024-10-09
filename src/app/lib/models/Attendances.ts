import mongoose, { Schema, Document } from "mongoose";

//Specifying the properties of the schema object
interface IAttendance extends Document {
  studentId: string;
  timestamp: Date;
  status?: string;
}

const AttendanceSchema: Schema = new Schema<IAttendance>({
  studentId: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
  status: {
    type: String,
    default: "absent",
    enum: ["present", "late", "absent"],
  },
});

// Ensure studentId and timestamp are unique for a single attendance log in a day
// Ensure studentId and timestamp are unique (for the same day)
AttendanceSchema.index({ studentId: 1, timestamp: 1 }, { unique: true });

export default mongoose.models.Attendances ||
  mongoose.model<IAttendance>("Attendances", AttendanceSchema);
