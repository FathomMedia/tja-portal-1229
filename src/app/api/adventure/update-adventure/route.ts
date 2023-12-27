import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  // const { slug, dataToSend } = await request.json();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const data = await request.formData();
  data.append("_method", "PUT");
  // data.delete("add_ons");
  console.log(data);
  console.log(typeof data);

  // const image = data.get("files");
  // console.log("🚀 ~ file: route.ts:23 ~ PUT ~ image:", image);

  // const add_ons = JSON.parse(data.get("add_ons") as string);

  // const dataToSend = {
  //   title: data.get("title"),
  //   arabic_title: data.get("arabic_title"),
  //   description: data.get("description"),
  //   arabic_description: data.get("arabic_description"),
  //   country_id: data.get("country_id"),
  //   price: data.get("price"),
  //   capacity: data.get("capacity"),
  //   gift_points: data.get("gift_points"),
  //   gender: data.get("gender"),
  //   add_ons: add_ons,
  //   start_date: data.get("start_date"),
  //   end_date: data.get("end_date"),
  //   ...(image && { image: image }),
  // };
  // console.log("🚀 ~ file: route.ts:43 ~ PUT ~ dataToSend:", dataToSend);

  // return await apiReq({
  // endpoint: `/adventures/${data.get("slug")}`,
  //   locale: request.headers.get("Accept-Language") || "en",
  //   method: "PUT",
  //   token: token?.value,
  //   values: dataToSend,
  // }).then(async (value) => {
  //   if (value.ok) {
  //     const data = await value.json();
  //     return NextResponse.json(data, { status: 200 });
  //   }

  //   const data = await value.json();
  //   return NextResponse.json(data, { status: value.status });
  // });

  // const route = `${api}/adventures`;
  const route = `${process.env.NEXT_PUBLIC_API_URL}/adventures/${data.get(
    "slug"
  )}`;
  console.log("🚀 ~ file: route.ts:64 ~ PUT ~ route:", route);
  return fetch(route, {
    method: "POST",
    cache: "no-cache",
    headers: token?.value
      ? {
          "Accept-Language": request.headers.get("Accept-Language") || "en",
          // "Content-Type": "multipart/form-data",
          Accept: "application/json",
          Authorization: `Bearer ${token?.value}`,
        }
      : {
          "Accept-Language": request.headers.get("Accept-Language") || "en",
          // "Content-Type": "application/json",
          // "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
    body: data,
  })
    .then(async (value) => {
      if (value.ok) {
        console.log("🚀 ~ file: route.ts:86 ~ .then ~ value.ok:", value.ok);
        const data = await value.json();
        console.log("🚀 ~ file: route.ts:83 ~ .then ~ data:", data);
        return NextResponse.json(data, { status: 200 });
      }

      const data = await value.json();
      console.log("🚀 ~ file: route.ts:83 ~ .then ~ data:", data);
      return NextResponse.json(data, { status: value.status });
    })
    .catch((error) => {
      console.log("🚀 ~ file: route.ts:94 ~ PUT ~ error:", error);
      return NextResponse.json({ data: null, error: error }, { status: 503 });
    });
}

// import { apiReq } from "@/lib/apiHelpers";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export async function PUT(request: NextRequest) {
//   const { slug, dataToSend } = await request.json();
//   const cookieStore = cookies();
//   const token = cookieStore.get("authToken");

//   console.log("🚀 ~ file: route.ts:7 ~ PUT ~ dataToSend:", dataToSend);

//   return await apiReq({
//     endpoint: `/adventures/${slug}`,
//     locale: request.headers.get("Accept-Language") || "en",
//     method: "PUT",
//     token: token?.value,
//     values: dataToSend,
//   }).then(async (value) => {
//     if (value.ok) {
//       const data = await value.json();
//       return NextResponse.json(data, { status: 200 });
//     }

//     const data = await value.json();
//     return NextResponse.json(data, { status: value.status });
//   });
// }
