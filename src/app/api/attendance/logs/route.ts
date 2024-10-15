import dbConnect from "@/app/lib/db";
import Attendances from "@/app/lib/models/Attendances";
import Students from "@/app/lib/models/Students";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  try {
    const { cardId, timestamp } = reqBody;

    if (!cardId) {
      return NextResponse.json(
        { message: "Kindly add a card ID" },
        { status: 400 }
      );
    }

    const student = await Students.findOne({ card_id: cardId });

    if (!student) {
      return NextResponse.json({ message: "Invalid card ID" }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Get today's date, resetting to midnight

    // Check if attendance has already been logged today
    const existingAttendance = await Attendances.findOne({
      studentId: student.student_id,
      date: today, // Use today's date to differentiate attendance by day
    });

    if (existingAttendance) {
      return NextResponse.json({
        message: "Attendance already taken for today",
      });
    }

    const attendanceTimestamp = timestamp ? new Date(timestamp) : new Date();

    // Entrance time logic to check if the student is late
    const entranceTimeEnd = new Date();
    entranceTimeEnd.setHours(9, 0, 0, 0); // End of entrance period (9:00 AM)

    let status = "present"; // Default status for on-time attendance
    if (attendanceTimestamp > entranceTimeEnd) {
      status = "late"; // Mark as late if the timestamp exceeds 9:00 AM
    }

    // Create a new attendance record with the current date
    const attendance = new Attendances({
      studentId: student.student_id,
      timestamp: attendanceTimestamp,
      status,
      date: today, // Store today's date to track attendance by day
    });

    // Save the attendance record
    const savedAttendance = await attendance.save();

    // Checking if the student status savedis present or absent
    if (status === "present") {
      // Update to mark the student as present, remove any absence records for today
      await Students.updateOne(
        { _id: student._id, "attendance_status.date": today },
        {
          $set: {
            "attendance_status.$.status": "present", // Change the status to present for today
          },
        }
      );
    } else if (status === "absent") {
      // If the student is marked absent, ensure the absence status is updated
      await Students.updateOne(
        { _id: student._id, "attendance_status.date": today },
        {
          $set: {
            "attendance_status.$.status": "absent", // Ensure absence status is recorded for today
          },
        }
      );
    }

    // Update the student's attendance status for today
    const updatedStudent = await Students.findOneAndUpdate(
      { _id: student._id },
      {
        $push: {
          attendance_status: {
            date: attendanceTimestamp, // Track the date of attendance
            status,
          },
        },
      },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Failed to update student's attendance status" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Attendance successfully recorded",
        savedAttendance,
        studentName: student.student_name,
        attendanceId: savedAttendance._id,
        updatedStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in attendance logging:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}


//Getting todays attendance
export async function GET() {
  try {
    // Get today's date and reset the time to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find all attendances for today
    const attendances = await Attendances.find({ date: today });

    if (!attendances.length) {
      return NextResponse.json({ message: "No attendance records for today" });
    }

    return NextResponse.json(attendances, { status: 200 });
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch today's attendance" },
      { status: 500 }
    );
  }
}

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


// Get attendance for a specific date (e.g., history for a given day)
export async function getAttendanceForDate(date: string) {
  try {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);  // Ensure it points to the start of the day

    const attendanceRecords = await Attendances.find({ date: targetDate });
    return attendanceRecords;
  } catch (error) {
    console.error("Error fetching attendance for the specified date:", error);
  }
}
