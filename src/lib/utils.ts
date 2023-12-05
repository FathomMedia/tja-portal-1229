import { api } from "@/config";
import { type ClassValue, clsx } from "clsx";
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
  return fetch(`${api}${endpoint}`, {
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
  });
}
