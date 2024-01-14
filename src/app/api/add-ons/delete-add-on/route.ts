import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  return await apiReq({
    endpoint: `/add-ons/${data.id}`,
    locale: request.headers.get("Accept-Language") || "en",
    method: "DELETE",
    token: token?.value,
  }).then(async (value) => {
    if (value.ok) {
      const data = await value.json();
      return NextResponse.json(data, { status: 200 });
    }
    const data = await value.json();
    return NextResponse.json(data, { status: value.status });
  });
}
