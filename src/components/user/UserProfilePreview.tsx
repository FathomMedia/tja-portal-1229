import { TUser } from "@/lib/types";
import React, { FC } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

type TUserProfilePreview = {
  user: TUser;
};

export const UserProfilePreview: FC<TUserProfilePreview> = ({ user }) => {
  const t = useTranslations("Dashboard");

  return (
    <div className="p-6 text-primary rounded-lg flex flex-col gap-2">
      {/* profile avatar */}
      <div className="flex justify-between gap-4 items-center">
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
        <LanguageSwitcher />
      </div>
    </div>
  );
};
