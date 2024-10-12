import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await NextResponse.json({
      message: "User logged out Sucessfully",
      sucess: true,
      status: 201,
    });

    //Killing the cookies
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while logging out." },
      { status: 500 }
    );
  }
}
