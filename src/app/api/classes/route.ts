import Students, { IStudent } from "@/app/lib/models/Students";
import { NextRequest, NextResponse } from "next/server";

// Define the types for the request body
interface AttendanceRequestBody {
  selectedClass: string;
  selectedCourse: string;
}

// Define the structure for the attendance data in the response
interface AttendanceResponseData {
  student_name: string;
  student_id: string;
  attendance_status: {
    date: Date;
    status: string;
  }[];
}

// Define the response type for the API
interface AttendanceApiResponse {
  success: boolean;
  attendance?: AttendanceResponseData[];
  message?: string;
}

// POST: Handle the request to get attendance data for a specific class and course
export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const { selectedClass, selectedCourse }: AttendanceRequestBody =
      await req.json();

    // Fetch students based on class and course
    const students: IStudent[] = await Students.find({
      class_name: selectedClass,
      course: selectedCourse,
    });

    // Map the students to return attendance data
    const attendanceData: AttendanceResponseData[] = students.map(
      (student) => ({
        student_name: student.student_name,
        student_id: student.student_id,
        attendance_status: student.attendance_status, // Fetch attendance details
      })
    );

    // Return the attendance data
    return NextResponse.json<AttendanceApiResponse>(
      { success: true, attendance: attendanceData },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message); // Safely access the error message
      return NextResponse.json<AttendanceApiResponse>(
        { success: false, message: error.message }, // Use the error message for better debugging
        { status: 500 }
      );
    } else {
      console.error("An unexpected error occurred");
      return NextResponse.json<AttendanceApiResponse>(
        { success: false, message: "Server Error" },
        { status: 500 }
      );
    }
  }
}

// Handle unsupported methods
export function OPTIONS() {
  return NextResponse.json(
    { success: false, message: "Method not allowed" },
    { status: 405 }
  );
}
