import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const data: { id: number } = await request.json();

  const dataResponse = await apiReq({
    endpoint: `/adventure-bookings/${data.id}/reject`,
    locale,
    method: "POST",
    token: token?.value,
    values: data,
  })
    .then(async (res) => await res.json())
    .catch((error) => {
      return NextResponse.json(error, { status: 401 });
    });

  return NextResponse.json(dataResponse, { status: 200 });
}
