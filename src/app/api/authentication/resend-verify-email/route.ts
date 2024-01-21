import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  return await apiReq({
    endpoint: "/auth/email/resend",
    locale,
    method: "POST",
    token: token?.value,
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data, { status: 200 });
      }
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    })
    .catch((error) => {
      return NextResponse.json({ data: null, error: error }, { status: 503 });
    });
}
