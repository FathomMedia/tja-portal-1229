import { apiReq } from "@/lib/apiHelpers";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const dataToSend: {
    date_of_birth: string;
    recaptcha_token: string;
    name: string;
    gender: string;
    email: string;
    password: string;
    phone: string;
    password_confirmation: string;
  } = await request.json();
  const cookieStore = cookies();

  return await apiReq({
    endpoint: "/auth/register",
    locale: request.headers.get("Accept-Language") || "en",
    method: "POST",
    values: dataToSend,
  }).then(async (value) => {
    console.log("🚀 ~ file: route.ts:18 ~ POST ~ value:", value);
    if (value.ok) {
      const data = await value.json();
      console.log("🚀 ~ file: route.ts:21 ~ POST ~ data:", data);

      cookieStore.set("authToken", data["access_token"], {
        httpOnly: true,
        path: "/",
      });

      return NextResponse.json(data, { status: 200 });
    }

    return value;
  });
}
