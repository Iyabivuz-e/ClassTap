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
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendances.findOne({
      studentId: student.student_id,
      timestamp: { $gte: today },
    });

    if (existingAttendance) {
      return NextResponse.json({ message: "Attendance already taken" });
    }

    const attendance = new Attendances({
      studentId: student.student_id,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      status: "present",
    });

    const savedAttendance = await attendance.save();

    return NextResponse.json(
      {
        message: "Attendance is taken successfully",
        savedAttendance,
        studentName: student.student_name, // Use correct field name
        attendanceId: savedAttendance._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in attendance logging:", error); // Log the error for better visibility
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
