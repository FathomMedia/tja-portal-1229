import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  return await apiReq({
    endpoint: "/auth/email/verify",
    locale,
    method: "POST",
    token: token?.value,
    values: {
      otp: otp,
    },
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      console.log("🚀 ~ file: route.ts:24 ~ POST ~ data:", data);

      return NextResponse.json(data, { status: 200 });
    }
    return res;
  });
}
