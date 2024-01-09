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
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  return await apiReq({
    endpoint: "/admins/accept",
    locale: request.headers.get("Accept-Language") || "en",
    method: "POST",
    token: token?.value,
    values: dataToSend,
  }).then(async (value) => {
    console.log("🚀 ~ file: route.ts:18 ~ POST ~ value:", value);
    if (value.ok) {
      const data = await value.json();
      console.log("🚀 ~ file: route.ts:21 ~ POST ~ data:", data);

      return NextResponse.json(data, { status: 200 });
    }

    return value;
  });
}
