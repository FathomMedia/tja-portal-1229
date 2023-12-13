import { api } from "@/config";
import { type ClassValue, clsx } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type TApiReq = {
  endpoint: string;
  locale: string;
  token?: string;
  values?: any;
  method?: "GET" | "POST" | "PUT" | "DEL";
};
export async function apiReq({
  endpoint,
  locale,
  values,
  token,
  method,
}: TApiReq) {
  const route = `${api}${endpoint}`;
  return fetch(route, {
    method: method ?? "GET",
    headers: token
      ? {
          "Accept-Language": locale,
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        }
      : {
          "Accept-Language": locale,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
    body: values ? JSON.stringify(values) : undefined,
  }).catch((error) => {
    return NextResponse.json({ data: null, error: error }, { status: 503 });
  });
}
