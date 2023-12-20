import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  return NextResponse.json(token?.value ?? null, { status: 200 });
}
