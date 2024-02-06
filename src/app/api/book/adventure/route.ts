import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("here token", token);
  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    slug: string;
    dataToRequest: {
      reason: string;
      coupon: string | null;
      add_ons: number[] | null;
      is_partial: boolean;
      payment_method: "benefitpay" | "applepay" | "card";
    };
  } = await request.json();

  console.log("here", data);

  return await apiReq({
    endpoint: `/adventures/${data.slug}/book`,
    locale,
    method: "POST",
    token: token?.value,
    values: data.dataToRequest,
  })
    .then(async (res) => {
      const bookingResponse = await res.json();
      if (res.ok) {
        return NextResponse.json(bookingResponse, { status: 200 });
      }

      return NextResponse.json(bookingResponse, { status: res.status });
    })
    .catch((error) => {
      return NextResponse.json({ data: null, error: error }, { status: 503 });
    });
}
