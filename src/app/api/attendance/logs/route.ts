import dbConnect from "@/app/lib/db";
import Attendances from "@/app/lib/models/Attendances";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  try {
    const { studentId, timestamp } = reqBody;

    //checking if the student ID is valid and the timestamp is in the correct format.
    if (!studentId) {
      return NextResponse.json(
        { message: "Kindly add a student ID" },
        { status: 400 }
      );
    }

    //To prevent duplicate attendance logs for the same student in the same day (or class period),
    //the system could first check if there’s already an entry for that student today.
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendances.findOne({
      studentId: studentId,
      timestamp: { $gte: today },
    });

    if (existingAttendance) {
      return NextResponse.json({ message: "Attendace already taken" });
    }

    //Creating a new attendance entry for the student in the same day and save it in the database.
    const attendance = new Attendances({
        studentId: studentId,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        status: "present"
    })

    //saving the attendance in the database
    const savedAttendance = await attendance.save();

    //returning the attendance response
    return NextResponse.json(
      {
        message: "Attendance  is taken successfully",
        savedAttendance,
        attendanceId: savedAttendance._id,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
