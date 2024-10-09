import dbConnect from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import students from "@/app/lib/models/Students";

dbConnect();

export async function POST(request: NextRequest) {
  //authenticating a student with their card ID...
  try {
    const reqBody = await request.json();

    const { cardId } = reqBody;

    //Getting the student based on the card id assigned to them...
    const student = await students.findOne({ card_id: cardId });
    

    if (student) {
      return NextResponse.json(
        {
          studentId: student.student_id,
          studentName: student.student_name,
          status: "Authenticated",
        },
        { status: 200 }
      );
      // If there is no student found based on the card id, then return no student found...
    } else {
      return NextResponse.json(
        { message: "No student found with the card id" },
        { status: 404 }
      );
    }
  } catch (error) {

    return NextResponse.json(
      { message: "Error querying the databse" },
      { status: 500 }
    );
  }
}
