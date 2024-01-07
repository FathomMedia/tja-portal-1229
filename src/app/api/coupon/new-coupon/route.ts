import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    dataToRequest: {
      type: "percentage" | "fixed";
      code: string;
      applyTo: "adventure" | "consultation";
      value?: number | undefined;
      percentOff?: number | undefined;
      minPoints?: number | undefined;
      maxPoints?: number | undefined;
    };
  } = await request.json();

  const createCouponResponse = await apiReq({
    endpoint: `/coupons`,
    locale,
    method: "POST",
    token: token?.value,
    values: {
      type: data.dataToRequest.type,
      code: data.dataToRequest.code,
      apply_to: data.dataToRequest.applyTo,
      ...(data.dataToRequest.value && { value: data.dataToRequest.value }),
      ...(data.dataToRequest.percentOff && {
        percent_off: data.dataToRequest.percentOff,
      }),
      ...(data.dataToRequest.minPoints && {
        min_points: data.dataToRequest.minPoints,
      }),
      ...(data.dataToRequest.maxPoints && {
        max_points: data.dataToRequest.maxPoints,
      }),
    },
  })
    .then(async (res) => await res.json())
    .catch((error) => {
      return NextResponse.json(error, { status: 401 });
    });
  console.log(
    "🚀 ~ file: route.ts:28 ~ POST ~ createCouponResponse:",
    createCouponResponse
  );

  return NextResponse.json(createCouponResponse, { status: 200 });
}
