import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/utils";
import { error } from "console";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const user = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token?.value,
  })
    .then(async (res) => await res.json())
    .catch((error) => {
      return NextResponse.json(error, { status: 401 });
    });

  console.log("🚀 ~ file: get-user ~ route.ts:17 ~ GET ~ user:", user);

  return NextResponse.json(user, { status: 200 });
}
