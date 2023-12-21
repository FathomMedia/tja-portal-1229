import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    code: string;
  } = await request.json();

  const couponRes = await apiReq({
    endpoint: `/coupons/${data.code}/redeem`,
    // endpoint: `/coupons/JOURNEY5ADVENTURE/redeem`,
    locale,
    method: "POST",
    token: token?.value,
  })
    .then(async (res) => {
      return res;
    })
    .catch((error) => {
      return NextResponse.json(error, { status: 500 });
    });

  return couponRes;
}
