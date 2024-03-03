import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// ! NOT USED ANY MORE, CLIENT CALL THE SERVER DIRECTLY CUZ OF THE UPLOAD SIZE LIMIT FROM VERCEL
// ! SERVERLESS BODY SIZE LIMITATION OF 4.5MB

export async function PUT(request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const data = await request.formData();
  data.append("_method", "PUT");

  const route = `${process.env.NEXT_PUBLIC_API_URL}/adventures/${data.get(
    "slug"
  )}`;

  console.log("🚀 ~ file: route.ts:9 ~ PUT ~ data:", data);

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
      console.log(value);
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
