import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  if (token) {
    const locale = request.headers.get("accept-language") ?? "en";

    const data: {
      id: number;
    } = await request.json();

    const consultation = await apiReq({
      endpoint: `/consultations/${data.id}`,
      locale,
      token: token?.value,
    });

    if (consultation.ok) {
      const data = await consultation.json();

      return NextResponse.json(data, { status: 200 });
    } else {
      return NextResponse.json({ data: null }, { status: 401 });
    }
  } else {
    return NextResponse.json({ data: null }, { status: 401 });
  }
}
