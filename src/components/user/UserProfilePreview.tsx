"use client";
import { TUser } from "@/lib/types";
import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

export const UserProfilePreview: FC = () => {
  const t = useTranslations("Dashboard");

  const locale = useLocale();

  const { data: user, isFetching: isFetchingUser } = useQuery<TUser>({
    queryKey: ["/users/profile"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/users/profile", locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
  });

  return (
    <div className="p-6 text-primary rounded-lg flex flex-col gap-2">
      {/* profile avatar */}

      <div className="flex justify-between gap-4 items-center">
        {!isFetchingUser && user && (
          <div className="flex gap-3 items-center">
            <Avatar className="">
              {user.avatar && <AvatarImage src={user.avatar} />}
              <AvatarFallback className="text-primary-foreground bg-primary">
                {user.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2>{t("hello")}</h2>
              <h2 className="text-xl font-semibold">{user.name}</h2>
            </div>
          </div>
        )}
        {isFetchingUser && <Skeleton className="h-14 w-full max-w-xs" />}
        <LanguageSwitcher />
      </div>
    </div>
  );
};
