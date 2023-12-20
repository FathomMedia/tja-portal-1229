import { NextResponse } from "next/server";
import { getToken } from "@/lib/serverUtils";

export async function GET() {
  const token = getToken();
  return NextResponse.json(token ?? null, { status: 200 });
}
