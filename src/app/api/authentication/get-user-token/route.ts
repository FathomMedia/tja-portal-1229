import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  // console.log("🚀 ~ file: route.ts:7 ~ GET ~ token:", token);

  return NextResponse.json({ token: token?.value }, { status: 200 });
}
