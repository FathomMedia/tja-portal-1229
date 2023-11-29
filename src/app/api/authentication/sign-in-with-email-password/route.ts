import { apiReq } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const cookieStore = cookies();

  return await apiReq({
    endpoint: "/auth/login",
    locale: request.headers.get("Accept-Language") || "en",
    method: "POST",
    values: {
      email: email,
      password: password,
    },
  }).then(async (value) => {
    if (value.ok) {
      const data = await value.json();

      cookieStore.set("authToken", data["access_token"], {
        httpOnly: true,
        path: "/",
      });
      return NextResponse.json(data, { status: 200 });
    }

    return value;
  });
}
