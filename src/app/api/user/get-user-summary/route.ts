import { NextRequest, NextResponse } from "next/server";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const { token } = await request.json();

  if (token) {
    const locale = request.headers.get("accept-language") ?? "en";

    const user = await apiReq({
      endpoint: "/users/profile/summary",
      locale,
      token: token,
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
