import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";
import { TAdventureBookingOrder } from "@/lib/types";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const data: TAdventureBookingOrder = await request.json();

  const dataResponse = await apiReq({
    endpoint: `/adventure-bookings/${data.id}/cancel`,
    locale,
    method: "PUT",
    token: token?.value,
    values: data,
  })
    .then(async (res) => await res.json())
    .catch((error) => {
      return NextResponse.json(error, { status: 401 });
    });

  return NextResponse.json(dataResponse, { status: 200 });
}
