import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/utils";
import { getToken } from "@/lib/serverUtils";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  // const token = getToken();
  console.log("🚀 ~ file: route.ts:10 ~ GET ~ token:", token);

  if (token) {
    const locale = request.headers.get("accept-language") ?? "en";

    const user = await apiReq({
      endpoint: "/users/profile",
      locale,
      token: token,
    });

    console.log("🚀 ~ file: route.ts:21 ~ POST ~ user.ok:", user.ok);
    console.log("🚀 ~ file: route.ts:21 ~ POST ~ user.status:", user.status);

    if (user.ok) {
      const data = await user.json();
      console.log("🚀 ~ file: route.ts:23 ~ POST ~ data:", data);
      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ data: null }, { status: 401 });
    }
  } else {
    return NextResponse.json({ data: null }, { status: 401 });
  }
}
