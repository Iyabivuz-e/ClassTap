// **************RESET ATTENDANCE AT THE END OF THE DAY********************

import Attendances from "./models/Attendances";
import Students from "./models/Students";

// Function to reset attendance at the end of the day (could be scheduled via cron job)
export async function resetAttendanceForNewDay() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Get today's date

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date for comparison

    // Find all students who haven't recorded attendance for today
    const studentsWithoutAttendance = await Students.find({
      "attendance_status.date": { $lt: today }, // Filter for older attendance records
    });

    // Mark those students as absent for today
    for (const student of studentsWithoutAttendance) {
      await Attendances.create({
        studentId: student.student_id,
        status: "absent",
        date: today, // Mark as absent for today
        timestamp: new Date(),
      });

      // Update student's status
      await Students.updateOne(
        { _id: student._id },
        {
          $push: {
            attendance_status: {
              date: today,
              status: "absent",
            },
          },
        }
      );
    }

    console.log("Attendance reset completed successfully.");
  } catch (error) {
    console.error("Error resetting attendance for new day:", error);
  }
}
