import dbConnect from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";
import Students from "@/app/lib/models/Students";

dbConnect();

export async function POST(request: NextRequest) {
  const reqBody = await request.json();

  try {
    const {
      student_id,
      student_name,
      card_id,
      gender,
      class_name,
      course, // Ensure 'course' is included here
      profile_image, // Ensure 'course' is included here
      enrollment_year,
    } = reqBody;

    // Check if all required fields are provided, including 'course'
    if (
      !student_id ||
      !student_name ||
      !card_id ||
      !gender ||
      !class_name ||
      !course || // Make sure to check for 'course'
      !profile_image || 
      !enrollment_year
    ) {
      return NextResponse.json(
        { message: "Kindly input all required fields" },
        { status: 400 }
      );
    }

    // Creating a new student
    const newStudent = new Students({
      student_id,
      student_name,
      card_id,
      gender,
      class_name,
      course,
      profile_image,
      enrollment_year,
      status: "enrolled",
      attendance_status: [
        {
          date: new Date(),
          status: "absent",
        },
      ],
    });

    const savedStudent = await newStudent.save(); // Await the save operation

    return NextResponse.json(
      { response: savedStudent, message: "Student added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
