import dbConnect from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Directors from "@/app/lib/models/Directors";
import bcryptjs from "bcryptjs";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { fullname, email, password, schoolName } = reqBody;
    // Validations
    if (!fullname || !email || !password || !schoolName) {
      return NextResponse.json({
        message: "Please enter all of your credentials!",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Enforce specific domain (@dio.com)
    const requiredDomain = "@dio.com";
    if (!email.endsWith(requiredDomain)) {
      return NextResponse.json(
        { message: `Email must be from the ${requiredDomain} domain.` },
        { status: 400 }
      );
    }

    // Checking if a director exists
    const existingDirector = await Directors.findOne({ email });
    if (existingDirector) {
      return NextResponse.json(
        { message: "Director already exists!" },
        { status: 400 }
      );
    }

    //Hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    //Saving a new director to the database
    const newDirector = new Directors({
      fullname,
      email,
      password: hashedPassword,
      schoolName,
    });

    //Saving director in the database
    const savedDirector = await newDirector.save();

    return NextResponse.json(
      {
        message: "Director registered successfully!",
        director: {
          id: savedDirector._id,
          fullname: savedDirector.fullname,
          email: savedDirector.email,
          schoolName: savedDirector.schoolName,
          role: savedDirector.role,
        },
      },
      { status: 201 }
    );
    // Sending email to the director
  } catch (error) {
    // Handling errors
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while registering." },
      { status: 500 }
    );
  }
}





 // Enforce domain validation for email
    // const allowedDomain = "@dio.com";
    // if (!email.endsWith(allowedDomain)) {
    //   setError(`Email must end with ${allowedDomain}`);
    //   setLoading(false);
    //   return;
    // }