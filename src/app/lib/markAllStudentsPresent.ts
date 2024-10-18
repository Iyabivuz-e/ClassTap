import { NextResponse } from "next/server";
import Attendances from "./models/Attendances";
import Students from "./models/Students";

// Function to mark all students present
export async function markAllStudentsPresent() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set today's date to 00:00:00 for accurate date comparison

    const students = await Students.find(); // Fetch all students

    for (const student of students) {
      // Check if the attendance record exists for this student for today
      const existingAttendance = await Attendances.findOne({
        studentId: student._id,
        timestamp: {
          $gte: today, // Get records starting from today at 00:00:00
        },
      });

      if (existingAttendance) {
        // If a record exists, update it with the status "present"
        await Attendances.updateOne(
          { _id: existingAttendance._id },
          { $set: { status: "present", timestamp: new Date() } }
        );
      } else {
        // If no record exists for today, create a new one
        await Attendances.create({
          studentId: student._id,
          status: "present",
          timestamp: new Date(),
        });
      }
    }

    return NextResponse.json(
      { message: "All students marked present successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking all students present:", error);
    return NextResponse.json(
      { error: "Failed to mark all students present" },
      { status: 500 }
    );
  }
}
