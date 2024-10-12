import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  //Getting the absolute path
  const path = request.nextUrl.pathname;

  //Getting the public paths
  const isPublicPath = path === "/" || path === "/forgot-password";

  //Getting the tokens from the server
  const token = request.cookies.get("token")?.value || "";

  //If is public path and has token ( Meaning if a user has authenticated)
  //A user is redirected to the dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(
      new URL("/director-of-study/dashboard", request.nextUrl)
    );
  }

  //If is not public path and has not token ( Meaning user is not authenticated)
  //A user will stick on the main page until logs in.
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }
}

//Exporting the routes
export const config = {
    matcher: [
        "/",
        "/director-of-study/dashboard"
    ]
}