import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/apiHelpers";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  const data: {
    id: number;
    name: string;
    arabic_name: string;
  } = await request.json();

  const dataResponse = await apiReq({
    endpoint: `/add-ons/${data.id}`,
    locale,
    method: "PUT",
    token: token?.value,
    values: {
      name: data.name,
      arabic_name: data.arabic_name,
    },
  })
    .then(async (res) => await res.json())
    .catch((error) => {
      return NextResponse.json(error, { status: 401 });
    });

  return NextResponse.json(dataResponse, { status: 200 });
}
