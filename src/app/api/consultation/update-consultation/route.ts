import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";
import { TConsultation } from "@/lib/types";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const data: TConsultation = await request.json();

  console.log("🚀 ~ file: route.ts:25 ~ PUT ~ dataResponse:", data.id);
  const dataResponse = await apiReq({
    endpoint: `/consultations/${data.id}`,
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
