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
      enrollment_year,
    } = reqBody;

    if (
      !student_id ||
      !student_name ||
      !card_id ||
      !gender ||
      !class_name ||
      !enrollment_year
    ) {
      return NextResponse.json({ message: "Kindly input all required fields" });
    }

    //Adding a student
    const newStudent = await new Students({
      student_id,
      student_name,
      card_id,
      gender,
      class_name,
      enrollment_year,
    });

    const savedStudent = newStudent.save();

    if (!savedStudent) {
      return NextResponse.json(
        {
          message: "Failed to add a student in the database",
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { response: savedStudent, message: "Student is added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
