import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
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
  return Intl.NumberFormat(locale === "ar" ? "ar-BH" : locale, {
    currency: "BHD",
    style: "currency",
  }).format(price);
}

export function parseDateFromAPI(stringDate: string) {
  dayjs.extend(customParseFormat);
  return dayjs(stringDate, "DD/MM/YYYY").toDate();
}
