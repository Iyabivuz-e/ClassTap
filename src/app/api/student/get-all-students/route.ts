import dbConnect from "@/app/lib/db";
import Students from "@/app/lib/models/Students";
import { NextResponse } from "next/server";

dbConnect();

export async function GET() {
  try {
    const students = await Students.find();

    if (!students) {
      return NextResponse.json(
        { message: "No students found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ students }, { status: 201 });

  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
