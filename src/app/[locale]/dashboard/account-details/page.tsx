"use client";
import { Separator } from "@/components/ui/separator";
import { DeleteProfile } from "@/components/user/DeleteUserProfile";
import { UserAccountDetails } from "@/components/user/UserAccountDetails";
import { UserUpdateEmail } from "@/components/user/UserUpdateEmail";
import { UpdatePassword } from "@/components/user/UserUpdatePassword";

import { TUser } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSection } from "@/components/DashboardSection";

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
    <DashboardSection
      title={t("updateProfile")}
      className="max-w-4xl flex flex-col gap-10"
    >
      {isFetchingUser && <Skeleton className="w-full h-64" />}
      {user && !isFetchingUser && <UserAccountDetails user={user} />}
      <Separator />
      <div className=" space-y-4">
        <h2 className="text-2xl text-primary  font-helveticaNeue font-black  border-s-4 border-primary ps-2">
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
        <h2 className="text-2xl text-primary  font-helveticaNeue font-black  border-s-4 border-primary ps-2">
          {t("changePassword")}
        </h2>
      </div>
      <UpdatePassword />
      <Separator />
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl text-destructive font-helveticaNeue font-black border-s-4 border-destructive ps-2">
          {t("dangerArea")}
        </h2>
        <DeleteProfile />
      </div>
    </DashboardSection>
  );
}
