import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const data = await request.formData();
  data.append("_method", "PUT");
  console.log("🚀 ~ file: route.ts:9 ~ PUT ~ data:", data);

  const route = `${process.env.NEXT_PUBLIC_API_URL}/adventures/${data.get(
    "slug"
  )}`;

  return fetch(route, {
    method: "POST",
    cache: "no-cache",
    headers: {
      "Accept-Language": request.headers.get("Accept-Language") || "en",
      Accept: "application/json",
      ...(token?.value && { Authorization: `Bearer ${token.value}` }),
    },
    body: data,
  })
    .then(async (value) => {
      if (value.ok) {
        const data = await value.json();

        return NextResponse.json(data, { status: 200 });
      }

      const data = await value.json();

      return NextResponse.json(data, { status: value.status });
    })
    .catch((error) => {
      return NextResponse.json({ data: null, error: error }, { status: 503 });
    });
}
