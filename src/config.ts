export const availableLocales = ["en", "ar"];
export const timezone = "Asia/Bahrain";

export const MAX_IMAGE_SIZE = 2000000;
export const MAX_ADMIN_FILE_SIZE = 10000000;

export const api =
  process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.15.122:8000/api";

export const imagesApi =
  process.env.NEXT_PUBLIC_IMAGE_API_URL ??
  "https://the-journey-adventures.nyc3.digitaloceanspaces.com";
