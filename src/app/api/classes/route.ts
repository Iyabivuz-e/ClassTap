import Students, { IStudent } from "@/app/lib/models/Students";
import Attendances from "@/app/lib/models/Attendances";
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

    // Get the recent attendance data for each student
    const attendanceData: AttendanceResponseData[] = await Promise.all(
      students.map(async (student) => {
        // Fetch the most recent attendance for the student
        const recentAttendance = await Attendances.findOne({
          studentId: student._id,
        })
          .sort({ timestamp: -1 }) // Sort by timestamp to get the latest record
          .exec();

        // Map the student and attendance data into the response structure
        return {
          student_name: student.student_name,
          student_id: student.student_id,
          card_id: student.card_id,
          attendance_status: recentAttendance
            ? [
                {
                  date: recentAttendance.timestamp,
                  status: recentAttendance.status,
                },
              ]
            : [], // If no attendance found, return an empty array
        };
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
