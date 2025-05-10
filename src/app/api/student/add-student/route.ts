import dbConnect from "@/app/lib/db";
import { NextResponse, NextRequest } from "next/server";
import Students, { IStudent } from "@/app/lib/models/Students"; // Assuming IStudent is your Mongoose document interface

// Ensure DB connection
dbConnect();

interface StudentRequestBody {
  student_id: string;
  student_name: string;
  card_id: string;
  gender: string;
  class_name: string;
  course: string;
  profile_image: string;
  enrollment_year: string; // Keep as string, Mongoose will attempt to cast if schema type is Number
}

export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as StudentRequestBody;

    const {
      student_id,
      student_name,
      card_id,
      gender,
      class_name,
      course,
      profile_image,
      enrollment_year,
    } = reqBody;

    // More specific validation for missing fields
    const requiredFields: (keyof StudentRequestBody)[] = [
      "student_id",
      "student_name",
      "card_id",
      "gender",
      "class_name",
      "course",
      "profile_image",
      "enrollment_year",
    ];

    for (const field of requiredFields) {
      if (!reqBody[field] || String(reqBody[field]).trim() === "") {
        return NextResponse.json(
          {
            message: `Missing required field: ${field.replace(/_/g, " ")}`,
            field,
          },
          { status: 400 }
        );
      }
    }

    // Optional: Validate enrollment_year format if needed (e.g., ensure it's a 4-digit number)
    if (!/^\d{4}$/.test(enrollment_year)) {
      return NextResponse.json(
        {
          message: "Enrollment year must be a 4-digit number.",
          field: "enrollment_year",
        },
        { status: 400 }
      );
    }

    // Creating a new student
    const newStudentData = {
      student_id,
      student_name,
      card_id,
      gender,
      class_name,
      course,
      profile_image,
      enrollment_year: parseInt(enrollment_year, 10), // Convert to number if your schema expects it
      status: "enrolled",
      attendance_status: [
        {
          date: new Date(),
          status: "absent", // Default to absent on creation day, or adjust as needed
        },
      ],
    };

    const newStudent = new Students(newStudentData);
    const savedStudent = await newStudent.save();

    return NextResponse.json(
      {
        student: savedStudent, // Send back the created student object
        message: "Student added successfully!",
      },
      { status: 201 } // 201 Created is more appropriate for successful resource creation
    );
  } catch (error: any) {
    console.error("Error adding student:", error);

    if (error.name === "ValidationError") {
      // Mongoose validation error
      let errorMessages = "Validation failed: ";
      if (error.errors) {
        errorMessages += Object.values(error.errors)
          .map((err: any) => err.message)
          .join(", ");
      }
      return NextResponse.json(
        { message: errorMessages || "Validation error occurred." },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      // Duplicate key error (e.g., student_id or card_id already exists)
      const field = Object.keys(error.keyValue)[0];
      return NextResponse.json(
        {
          message: `A student with this ${field.replace(
            /_/g,
            " "
          )} already exists.`,
          field,
        },
        { status: 409 } // 409 Conflict
      );
    }

    if (error instanceof SyntaxError && error.message.includes("JSON")) {
      return NextResponse.json(
        { message: "Invalid JSON payload provided." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
