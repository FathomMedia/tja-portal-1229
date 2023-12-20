import { api } from "@/config";
import { TUser } from "./types";
import { NextResponse } from "next/server";

export async function getUser({ locale }: { locale: string }) {
  const res = await fetch("/api/user/get-user", {
    headers: {
      "Accept-Language": locale,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  const { data } = await res.json();
  const user: TUser = data;
  return user;
}

export const wait = () => new Promise((resolve) => setTimeout(resolve, 2000));

type TApiReq = {
  endpoint: string;
  locale: string;
  token?: string;
  values?: any;
  method?: "GET" | "POST" | "PUT" | "DELETE";
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
