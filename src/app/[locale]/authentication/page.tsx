import { Metadata } from "next";

import { UserAuthForm } from "@/components/auth/user-auth-form";
import { useLocale } from "next-intl";
import { getToken } from "@/lib/serverUtils";
import { apiReq } from "@/lib/utils";
import { TUser } from "@/lib/types";

export const metadata: Metadata = {
  title: "Authentication",
  description: "The Journey Adventures Authentication",
};

export default async function Page() {
  const locale = useLocale();
  const token = getToken();

  const user = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const { data } = await val.json();
      return data as TUser;
    }

    return null;
  });

  return (
    <div className=" w-full bg-background">
      <div>
        <p>Current user email: {user?.name ?? "No user"}</p>
        <p>Current user name: {user?.email ?? "No user"}</p>
      </div>
      {/* auth card */}
      <div className="container max-w-md flex flex-col items-center py-6  md:py-20">
        <UserAuthForm />
      </div>
    </div>
  );
}
