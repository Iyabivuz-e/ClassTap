import dbConnect from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Directors from "@/app/lib/models/Directors";
import bcryptjs from "bcryptjs";

// Ensure database connection
dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    // Log the entire request body to check its structure
    // console.log("Request Body: ", reqBody);

    const {
      fullname,
      email,
      password,
      schoolName,
      phoneNumber = null, // Default to null if not provided
      status = "active", // Default to "active" if not provided
      profilePicture = null,
      address = {}, // Default to an empty object if not provided
      permissions = [], // Default to an empty array if not provided
    } = reqBody;

    // console.log("Address: ", address); // Check the address field

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

    // Hashing the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create the director object with optional fields
    const newDirector = new Directors({
      fullname,
      email,
      password: hashedPassword,
      schoolName,
      phoneNumber,
      status,
      profilePicture,
      address, // Will be an empty object if not provided
      permissions,
    });

    // Save the director in the database
    const savedDirector = await newDirector.save();

    // Return the saved director, including the full address object
    return NextResponse.json(
      {
        message: "Director registered successfully!",
        director: savedDirector, // Return the full savedDirector object
      },
      { status: 201 }
    );
  } catch (error) {
    // Handling errors
    console.error("Error during registration:", error);
    return NextResponse.json(
      { error: "An error occurred while registering." },
      { status: 500 }
    );
  }
}
