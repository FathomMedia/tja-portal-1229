import { apiReq } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { old_password, new_password, new_password_confirmation } =
    await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  return await apiReq({
    endpoint: "/users/password/update",
    locale: request.headers.get("Accept-Language") || "en",
    method: "PUT",
    token: token?.value,
    values: {
      old_password: old_password,
      new_password: new_password,
      new_password_confirmation: new_password_confirmation,
    },
  }).then(async (value) => {
    if (value.ok) {
      const data = await value.json();
      return NextResponse.json(data, { status: 200 });
    }

    const data = await value.json();
    console.log("🚀 ~ file: route.ts:26 ~ POST ~ data:", data);
    return NextResponse.json(data, { status: value.status });
  });
}
