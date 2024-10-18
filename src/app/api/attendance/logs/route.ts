import dbConnect from "@/app/lib/db";
import { markAllStudentsPresent } from "@/app/lib/markAllStudentsPresent";
import Attendances from "@/app/lib/models/Attendances";
import Students from "@/app/lib/models/Students";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

// **********TAPPING THE CARD AND LOG TODAY'S ATTENDANCE****************
export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  try {
    const { cardId, timestamp, markAllPresent } = reqBody;

    if (markAllPresent) {
      return await markAllStudentsPresent();
    }

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

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of the day (midnight)

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of the day

    const attendanceTimestamp = timestamp ? new Date(timestamp) : new Date();

    const entranceTimeEnd = new Date();
    entranceTimeEnd.setHours(12, 0, 0, 0); // End of entrance period (12:00 PM)

    const status = attendanceTimestamp > entranceTimeEnd ? "late" : "present";

    // Check if the student already has attendance logged today
    let attendance = await Attendances.findOne({
      studentId: student._id,
      timestamp: { $gte: todayStart, $lte: todayEnd }, // Ensure it's today's attendance
    });

    // If no attendance record exists for today, create a new one
    if (!attendance) {
      attendance = new Attendances({
        studentId: student._id,
        timestamp: attendanceTimestamp,
        status,
      });

      await attendance.save();
    } else {
      // If the status has changed (e.g., "present" to "late"), update it
      if (attendance.status !== status) {
        attendance.status = status;
        attendance.timestamp = attendanceTimestamp; // Update timestamp if needed
        await attendance.save();
      } else {
        // If attendance already exists with the same status, don't log it again
        return NextResponse.json(
          {
            message: `Attendance already logged as ${status}`,
            studentName: student.student_name,
            attendanceId: attendance._id,
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        message: "Attendance successfully recorded",
        studentName: student.student_name,
        attendanceId: attendance._id,
        status: attendance.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in attendance logging:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

// **********GETTING TODAY'S ATTENDANCE****************
export async function GET() {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch attendance for today and populate student details
    const attendance = await Attendances.find({
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    }).populate({
      path: "studentId", // Reference the 'studentId' field in Attendances schema
      select: "student_id student_name card_id class_name", // Only select these fields
    });

    return NextResponse.json({ attendance }, { status: 200 });
  } catch (error) {
    console.error("Error fetching today’s attendance:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
