import { apiReq } from "@/lib/apiHelpers";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const dataToSend: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  } = await request.json();

  return await apiReq({
    endpoint: "/admins/accept",
    locale: request.headers.get("Accept-Language") || "en",
    method: "POST",
    values: dataToSend,
  }).then(async (value) => {
    if (value.ok) {
      const data = await value.json();

      return NextResponse.json(data, { status: 200 });
    }

    return value;
  });
}
