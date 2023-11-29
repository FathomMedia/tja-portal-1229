import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken");
  const authPath = "/authentication";

  //* Uncomment if you make auth
  // if (!token) {
  //   // Handle unauthenticated access
  //   return NextResponse.redirect(new URL(authPath, request.nextUrl));
  // }

  // Verify the token...

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|authentication|assets).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
