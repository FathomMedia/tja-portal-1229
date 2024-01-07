import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    customerId: number;
    code: string;
    reason: string;
  } = await request.json();

  const revokeRes = await apiReq({
    endpoint: `/coupons/${data.code}/revoke`,
    locale,
    method: "POST",
    token: token?.value,
    values: {
      customer_id: data.customerId,
      reason: data.reason,
    },
  })
    .then(async (res) => {
      return res;
    })
    .catch((error) => {
      return NextResponse.json(error, { status: 500 });
    });

  return revokeRes;
}
