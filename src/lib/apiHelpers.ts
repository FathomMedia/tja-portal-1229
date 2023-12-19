import { TUser } from "./types";

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
