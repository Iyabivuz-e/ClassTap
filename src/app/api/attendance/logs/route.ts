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
      attendanceStatus: (student.attendance_status.status = "present"), //this is not working
    });

    const savedAttendance = await attendance.save();

    //updating a student's attendance status to "present" for today
    const updatedStudent = await Students.findOneAndUpdate(
      student._id,
      {
        $set: {
          "attendance_status.$[elem].status": "present",
        },
      },
      {
        arrayFilters: [{ "elem.date": { $gte: today } }],
        new: true,
      }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Failed to update student's attendance status" },
        { status: 500 }
      );
    }


    return NextResponse.json(
      {
        message: "Attendance is taken successfully",
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
