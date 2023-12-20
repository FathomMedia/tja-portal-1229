import { apiReq } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  return await apiReq({
    endpoint: "/users/email/edit",
    locale: request.headers.get("Accept-Language") || "en",
    method: "POST",
    token: token?.value,
    values: {
      email: email,
    },
  })
    .then(async (value) => {
      console.log("🚀 ~ file: route.ts:20 ~ .then ~ value:", value);
      return value;
    })
    .catch((error) => {
      console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
      return NextResponse.json(error, { status: 500 });
    });
}
