import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  const { start_date, end_date, tier } = await request.json();

  const locale = request.headers.get("accept-language") ?? "en";

  return await apiReq({
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
    .then(async (res) => {
      const data = await res.json();

      if (res.ok) {
        return NextResponse.json(data, { status: 200 });
      }

      return NextResponse.json(data, { status: res.status });
    })
    .catch((error) => {
      return NextResponse.json({ data: null, error: error }, { status: 503 });
    });
}
