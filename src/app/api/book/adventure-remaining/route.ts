import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    bookingId: string;
    dataToRequest: {
      payment_method: "benefitpay" | "applepay" | "card";
    };
  } = await request.json();

  const bookingResponse = await apiReq({
    endpoint: `/adventure-bookings/${data.bookingId}/remaining`,
    locale,
    method: "POST",
    token: token?.value,
    values: data.dataToRequest,
  })
    .then(async (res) => await res.json())
    .catch((error) => {
      return NextResponse.json(error, { status: 401 });
    });

  return NextResponse.json(bookingResponse, { status: 200 });
}
