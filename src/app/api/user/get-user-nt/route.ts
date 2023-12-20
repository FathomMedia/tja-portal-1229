import { NextRequest, NextResponse } from "next/server";
import { apiReq } from "@/lib/apiHelpers";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  if (token) {
    const locale = request.headers.get("accept-language") ?? "en";

    const user = await apiReq({
      endpoint: "/users/profile",
      locale,
      token: token?.value,
    });

    if (user.ok) {
      const data = await user.json();

      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ data: null }, { status: 401 });
    }
  } else {
    return NextResponse.json({ data: null }, { status: 401 });
  }
}
