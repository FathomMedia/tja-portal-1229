import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  const { start_date, end_date, tier } = await request.json();

  const locale = request.headers.get("accept-language") ?? "en";

  const bookingResponse = await apiReq({
    endpoint: `/consultation-bookings/calculate`,
    locale,
    method: "POST",
    token: token?.value,
    values: {
      start_date: start_date,
      end_date: end_date,
      tier: tier,
    },
  })
    .then(async (res) => await res.json())
    .catch((error) => {
      return NextResponse.json(error, { status: 401 });
    });
  console.log(
    "🚀 ~ file: route.ts:28 ~ POST ~ bookingResponse:",
    bookingResponse
  );

  return NextResponse.json(bookingResponse, { status: 200 });
}
