// **************RESET ATTENDANCE AT THE END OF THE DAY********************

import Attendances from "./models/Attendances";
import Students from "./models/Students";

export async function resetAttendanceForNewDay() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Instead of checking attendance_status, get ALL students
    const allStudents = await Students.find({});

    // For each student, create or update attendance record
    for (const student of allStudents) {
      // Check if attendance already exists for today
      const existingAttendance = await Attendances.findOne({
        studentId: student._id,
        timestamp: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      // If no attendance record exists for today, create one with 'absent' status
      if (!existingAttendance) {
        await Attendances.create({
          studentId: student._id,
          status: "absent",
          timestamp: today,
        });
      }
    }

    console.log("Attendance reset completed successfully.");
  } catch (error) {
    console.error("Error resetting attendance for new day:", error);
    throw error;
  }
}