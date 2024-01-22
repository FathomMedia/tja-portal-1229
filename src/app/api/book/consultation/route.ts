import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    id: number;
    dataToRequest: {
      coupon: string | null;
      payment_method: "benefitpay" | "applepay" | "card";
      start_date: Date;
      end_date: Date;
      class: string;
      number_of_travelers: number;
      budget: string;
      budget_priority: string;
      budget_includes: string[];
      vacation_type: string;
      accommodation_type: string[];
      activities: string[];
      destination: string;
      adventure_meaning: string[];
      morning_activity: string;
      departure_airport: string;
      best_travel_experience: string;
      phobias: string | null;
    };
  } = await request.json();
  return await apiReq({
    endpoint: `/consultation-bookings/${data.id}/book`,
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
