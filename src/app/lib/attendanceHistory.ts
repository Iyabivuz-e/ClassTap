// **************ATTENDANCE HISTORY********************

import Attendances from "./models/Attendances";

// Get attendance for a specific date (e.g., history for a given day)
export async function getAttendanceForDate(date: string) {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Ensure it points to the start of the day

    const attendanceRecords = await Attendances.find({ date: targetDate });
    return attendanceRecords;
  } catch (error) {
    console.error("Error fetching attendance for the specified date:", error);
  }
}
