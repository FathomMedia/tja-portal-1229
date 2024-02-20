"use client";
import { Separator } from "@/components/ui/separator";
import { DeleteProfile } from "@/components/user/DeleteUserProfile";
import { UserUpdateEmail } from "@/components/user/UserUpdateEmail";
import { UpdatePassword } from "@/components/user/UserUpdatePassword";

import { TUser } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminAccountDetails } from "@/components/user/AdminAccountDetails";

export default function Page() {
  const locale = useLocale();

  const t = useTranslations("Profile");

  const { data: user, isFetching: isFetchingUser } = useQuery<TUser>({
    queryKey: ["/users/profile"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/users/profile", locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
  });

  return (
    <div className="max-w-4xl flex flex-col gap-10">
      <div>
        <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
          {t("updateProfile")}
        </h2>
      </div>
      {isFetchingUser && <Skeleton className="w-full h-64" />}
      {user && !isFetchingUser && <AdminAccountDetails user={user} />}
      <Separator />
      <div className=" space-y-4">
        <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
          {t("updateEmail")}
        </h2>
        {isFetchingUser && <Skeleton className="w-full max-w-sm h-6" />}
        {user && !isFetchingUser && (
          <div className=" text-sm text-muted-foreground">
            {t("yourEmail")}: <span className=" italic">{user.email}</span>
          </div>
        )}
      </div>
      <UserUpdateEmail />
      <Separator />
      <div>
        <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
          {t("changePassword")}
        </h2>
      </div>
      <UpdatePassword />
      <Separator />
      <div>
        <DeleteProfile />
      </div>
    </div>
  );
}
