import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiReq } from "@/lib/utils";

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const locale = request.headers.get("accept-language") ?? "en";

  return await apiReq({
    endpoint: "/auth/logout",
    locale,
    method: "POST",
    token: token?.value,
  })
    .then(async (res) => {
      if (res.ok) {
        cookieStore.delete("authToken");
      }
      const data = await res.json();

      return NextResponse.json(data, { status: 200 });
    })
    .catch((error) => {
      console.log("error", error);
      return NextResponse.json(error, { status: 401 });
    });
}
