import { api } from "@/config";
import { type ClassValue, clsx } from "clsx";
import { error } from "console";
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
    headers: {
      "Accept-Language": locale,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: values ? JSON.stringify(values) : undefined,
  });
}
