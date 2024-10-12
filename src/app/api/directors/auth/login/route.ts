import dbConnect from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Directors from "@/app/lib/models/Directors";

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Checking if the user has entered all the details
    if (!email || !password) {
      return NextResponse.json(
        { message: "Enter your credentials" },
        { status: 500 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Checking if the entered director does not exist in our database
    const director = await Directors.findOne({ email });
    if (!director) {
      return NextResponse.json(
        { message: "Director is not found" },
        { status: 400 }
      );
    }

    //Check if the password is valid
    const validPassword = await bcryptjs.compare(password, director.password);
    if (!validPassword) {
      return NextResponse.json(
        { message: "Incorrect password" },
        { status: 400 }
      );
    }

    //Generating the token for the loggedIn user with token data
    const tokenData = {
      id: director._id,
      fullname: director.fullname,
      email: director.email,
    };

    //Generating the token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRETS!, {
      expiresIn: "1h",
    });

    //Sending the response with the token to the browser's cookies
    const response = NextResponse.json(
      { message: "Director logged in sucessfully" },
      { status: 201 }
    );
    response.cookies.set("token", token, {httpOnly: true});
    return response;

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while logging in." },
      { status: 500 }
    );
  }
}
