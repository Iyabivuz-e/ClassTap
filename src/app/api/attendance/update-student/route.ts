import dbConnect from "@/app/lib/db";
import Attendances from "@/app/lib/models/Attendances";
import Students from "@/app/lib/models/Students";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

// PATCH function for updating attendance by cardId
export async function PATCH(request: NextRequest) {
  const reqBody = await request.json();
  const { cardId, newStatus } = reqBody;

  if (!cardId || !newStatus) {
    return NextResponse.json(
      { message: "Card ID and status are required" },
      { status: 400 }
    );
  }

  try {
    // Get current time in Kigali
    const now = new Date();
    const kigaliTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Africa/Kigali" })
    );

    // Find the student first
    const student = await Students.findOne({ card_id: cardId });
    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Get today's date range
    const todayStart = new Date(kigaliTime);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(kigaliTime);
    todayEnd.setHours(23, 59, 59, 999);

    // Find or create attendance record
    let attendance = await Attendances.findOne({
      studentId: student._id,
      timestamp: { $gte: todayStart, $lte: todayEnd },
    });

    if (attendance) {
      // Update existing record
      attendance.status = newStatus;
      attendance.timestamp = kigaliTime;
      attendance.isManualOverride = true; // Add this field to your schema if needed
    } else {
      // Create new record
      attendance = new Attendances({
        studentId: student._id,
        timestamp: kigaliTime,
        status: newStatus,
        isManualOverride: true,
      });
    }

    await attendance.save();

    return NextResponse.json(
      {
        message: `Attendance status updated to ${newStatus}`,
        studentName: student.student_name,
        cardId,
        status: attendance.status,
        timestamp: attendance.timestamp,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}