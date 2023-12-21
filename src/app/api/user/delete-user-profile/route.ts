import { apiReq } from "@/lib/apiHelpers";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  return await apiReq({
    endpoint: "/users/profile",
    locale: request.headers.get("Accept-Language") || "en",
    method: "DELETE",
    token: token?.value,
    values: {
      password: password,
    },
  }).then(async (value) => {
    console.log("🚀 ~ file: route.ts:19 ~ POST ~ value:", value);
    if (value.ok) {
      const data = await value.json();
      return NextResponse.json(data, { status: 200 });
    }

    const data = await value.json();
    console.log("🚀 ~ file: route.ts:26 ~ POST ~ data:", data);
    return NextResponse.json(data, { status: value.status });
  });
}
