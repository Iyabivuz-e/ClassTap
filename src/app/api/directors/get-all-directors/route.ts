import dbConnect from "@/app/lib/db";
import { NextResponse } from "next/server";
import Directors from "@/app/lib/models/Directors";

dbConnect();

export async function GET() {
  try {
    const directors = await Directors.find();

    if (!directors) {
      return NextResponse.json(
        { message: "No directors found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ directors }, { status: 201 });
  } catch (error) {
    console.error("Error fetching directors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
