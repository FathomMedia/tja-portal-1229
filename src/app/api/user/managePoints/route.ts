import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function POST(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    customerId: number;
    points: number;
    operation: string;
  } = await request.json();

  const revokeRes = await apiReq({
    endpoint: `/customers/${data.customerId}/points`,
    locale,
    method: "PUT",
    token: token?.value,
    values: {
      points: data.points,
      operation: data.operation,
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
