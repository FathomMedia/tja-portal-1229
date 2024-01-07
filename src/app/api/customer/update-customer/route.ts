import { apiReq } from "@/lib/apiHelpers";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { customerId, dataToSend } = await request.json();
  console.log("🚀 ~ file: route.ts:7 ~ PUT ~ dataToSend:", dataToSend);
  console.log("🚀 ~ file: route.ts:7 ~ PUT ~ customerId:", customerId);
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  return await apiReq({
    endpoint: `/customers/${customerId}`,
    locale: request.headers.get("Accept-Language") || "en",
    method: "PUT",
    token: token?.value,
    values: dataToSend,
  }).then(async (value) => {
    if (value.ok) {
      const data = await value.json();
      console.log("🚀 ~ file: route.ts:19 ~ PUT ~ data:", data);
      return NextResponse.json(data, { status: 200 });
    }

    const data = await value.json();
    console.log("🚀 ~ file: route.ts:24 ~ PUT ~ data:", data);
    return NextResponse.json(data, { status: value.status });
  });
}
