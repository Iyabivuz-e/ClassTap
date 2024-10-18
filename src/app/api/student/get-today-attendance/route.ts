import dbConnect from "@/app/lib/db";
import Students from "@/app/lib/models/Students";
import { NextResponse } from "next/server";
import moment from "moment";

dbConnect();

export async function GET() {
  try {
    const students = await Students.find();

    if (!students || students.length === 0) {
      return NextResponse.json(
        { message: "No students found" },
        { status: 404 }
      );
    }

    // Get today's date in 'YYYY-MM-DD' format
    const today = moment().startOf("day").format("YYYY-MM-DD");

    // Filter students' attendance status for today's date
    const studentsWithTodayAttendance = students.map((student) => {
      const todayAttendance = student.attendance_status.filter(
        (attendance) => moment(attendance.date).format("YYYY-MM-DD") === today
      );

      // Check if todayAttendance exists, if not, return empty attendance status
      return {
        ...student.toObject(),
        attendance_status: todayAttendance.length
          ? todayAttendance
          : [{ date: today, status: "Absent" }], // Mark as absent if no record
      };
    });

    return NextResponse.json(
      { students: studentsWithTodayAttendance },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
