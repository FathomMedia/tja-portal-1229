import { cookies } from "next/headers";

export function getToken() {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  return token?.value;
}
