import dbConnect from "@/app/lib/db";
import Attendances from "@/app/lib/models/Attendances";
import Students from "@/app/lib/models/Students";
import { NextRequest, NextResponse } from "next/server";
// import {io as ClientIO } from "socket.io-client"
import { broadcastAttendance } from "../notifications/route";

dbConnect();
// const socket = ClientIO("http://localhost:4000");


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

    const attendanceTimestamp = timestamp ? new Date(timestamp) : new Date(); //Attendance timestamp

    const attendance = new Attendances({
      studentId: student.student_id,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      status: "present",
    });

    const savedAttendance = await attendance.save();

    // //updating a student's attendance status to "present" for today
    // const updatedStudent = await Students.findOneAndUpdate(
    //   student._id,
    //   {
    //     $set: {
    //       "attendance_status.$[elem].status": "present",
    //     },
    //   },
    //   {
    //     arrayFilters: [{ "elem.date": { $gte: today } }],
    //     new: true,
    //   }
    // );

    // Update or push attendance status with the exact timestamp
    const updatedStudent = await Students.findOneAndUpdate(
      { _id: student._id },
      {
        $push: {
          attendance_status: {
            date: attendanceTimestamp, // Use the attendance timestamp
            status: "present",
          },
        },
      },
      {
        new: true,
      }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Failed to update student's attendance status" },
        { status: 500 }
      );
    }

    // Send the attendance data to the WebSocket server
    // socket.emit("new-attendance", {
    //   studentName: student.student_name,
    //   status: savedAttendance.status,
    //   timestamp: savedAttendance.timestamp,
    // });

    // After successfully saving attendance
    broadcastAttendance({
      studentName: student.student_name,
      status: savedAttendance.status,
      timestamp: savedAttendance.timestamp,
    });

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


