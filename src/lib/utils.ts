import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatePrice({
  locale,
  price,
}: {
  locale: string;
  price: number;
}) {
  return Intl.NumberFormat(locale, {
    currency: "BHD",
    style: "currency",
  }).format(price);
}
