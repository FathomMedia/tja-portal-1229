import { TUser } from "./types";
import { apiReq } from "./utils";

export async function getUser({ locale }: { locale: string }) {
  const res = await fetch("/api/user/get-user", {
    headers: {
      "Accept-Language": locale,
      "Content-Type": "application/json",
    },
  });

  const { data } = await res.json();
  const user: TUser = data;
  return user;
}

export async function getMyAchievements({
  locale,
  token,
}: {
  locale: string;
  token: string | undefined;
}) {
  const res = await apiReq({
    endpoint: "/profile/achievements",
    locale: locale,
    token,
  });

  const { data } = await res.json();

  return data;
}
