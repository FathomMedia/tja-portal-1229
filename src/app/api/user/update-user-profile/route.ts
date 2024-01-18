import { apiReq } from "@/lib/apiHelpers";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { dataToSend } = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("🚀 ~ PUT ~ dataToSend:", dataToSend);

  return await apiReq({
    endpoint: "/users/profile",
    locale: request.headers.get("Accept-Language") || "en",
    method: "PUT",
    token: token?.value,
    values: dataToSend,
  }).then(async (value) => {
    if (value.ok) {
      const data = await value.json();
      return NextResponse.json(data, { status: 200 });
    }

    const data = await value.json();
    return NextResponse.json(data, { status: value.status });
  });
}
