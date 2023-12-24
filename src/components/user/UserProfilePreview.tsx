"use client";
import { TUser } from "@/lib/types";
import React, { FC, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

import { buttonVariants } from "../ui/button";
import { MobileNav } from "../MobileNav";
import { cn } from "@/lib/utils";
import { isRtlLang } from "rtl-detect";

type TUserProfilePreview = {
  items: {
    href: string;
    title: string;
  }[];
};

export const UserProfilePreview: FC<TUserProfilePreview> = ({ items }) => {
  const t = useTranslations("Dashboard");
  const [open, setOpen] = useState(false);

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
        <div className="flex gap-3">
          <LanguageSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className={cn(
                "xl:hidden border-primary",
                buttonVariants({ variant: "outline", size: "icon" }),
                "border-primary"
              )}
            >
              <Menu className="text-primary" />
            </SheetTrigger>
            <SheetContent
              side={isRtlLang(locale) ? "left" : "right"}
              className="gap-6 flex flex-col"
            >
              <SheetHeader>
                <SheetTitle className="text-primary">
                  The Journey Adventures
                </SheetTitle>
              </SheetHeader>
              <ScrollArea dir={isRtlLang(locale) ? "rtl" : "ltr"}>
                <MobileNav items={items} onNavigate={() => setOpen(false)} />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
