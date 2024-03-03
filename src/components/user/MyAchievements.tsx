"use client";
import React, { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { TAchievement } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ImageOff } from "lucide-react";

export const MyAchievements: FC = () => {
  const locale = useLocale();
  const t = useTranslations("Achievements");

  const { data: achievements, isFetching: isFetchingAchievements } = useQuery<
    TAchievement[]
  >({
    queryKey: ["/profile/achievements"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/profile/achievements", locale }).then((res) =>
        res.json().then((resData) => {
          return resData.data;
        })
      ),
  });

  return (
    <div className="grid grid-cols-1 gap-4">
      {isFetchingAchievements && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
          <Skeleton className="w-full h-64 max-w-xs" />
          <Skeleton className="w-full h-64 max-w-xs" />
          <Skeleton className="w-full h-64 max-w-xs" />
        </div>
      )}
      {achievements && !isFetchingAchievements && (
        <h2 className="text-xl font-black font-helveticaNeue">
          {t("achieved")}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
        {achievements &&
          !isFetchingAchievements &&
          achievements
            .filter((val) => val.achieved)
            .map((ach, i) => (
              <Popover key={i}>
                <PopoverTrigger
                  className={cn(
                    " flex flex-col justify-center items-center gap-4 bg-[linear-gradient(45deg,transparent_25%,white_50%,transparent_75%,transparent_100%)]  relative max-w-md overflow-hidden rounded-xl border border-muted bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat px-8 py-16 shadow-xl  hover:bg-[position:200%_0,0_0] shadow-info/5 hover:duration-1000",
                    !ach.achieved && "bg-muted border-muted opacity-80"
                  )}
                >
                  {/* Shine Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-holographic-shine bg-[length:200%_100%]"></div>

                  {/* Your existing content */}
                  <Avatar className="w-24 h-24 max-sm:w-16 max-sm:h-16 z-10">
                    {ach.badge && (
                      <AvatarImage className="object-cover" src={ach.badge} />
                    )}
                    <AvatarFallback className="border border-muted-foreground rounded-full">
                      {<ImageOff className="w-4 h-4 text-muted-foreground" />}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground z-10">
                    {ach.title}
                  </p>
                </PopoverTrigger>
                <PopoverContent className="rounded-xl z-10">
                  <div className="flex gap-4 items-center">
                    <Avatar className="w-20 h-20 min-w-fit max-sm:w-16 max-sm:h-16">
                      {ach.badge && (
                        <AvatarImage className="object-cover" src={ach.badge} />
                      )}
                      <AvatarFallback>
                        {<ImageOff className="w-4 h-4 text-muted-foreground" />}
                      </AvatarFallback>
                    </Avatar>
                    <p className="w-full text-sm text-muted-foreground">
                      {ach.description}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
      </div>
      {achievements && !isFetchingAchievements && (
        <h2 className="text-xl font-black font-helveticaNeue">
          {t("toBeAchieved")}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-center">
        {achievements &&
          !isFetchingAchievements &&
          achievements
            .filter((val) => !val.achieved)
            .map((ach, i) => (
              <Popover key={i}>
                <PopoverTrigger
                  className={cn(
                    "flex flex-col gap-2 rounded-xl bg-white border-2 border-muted justify-center items-center p-6",
                    !ach.achieved && "bg-muted opacity-80"
                  )}
                >
                  <Avatar className="w-24 h-24 max-sm:w-16 max-sm:h-16">
                    {ach.badge && (
                      <AvatarImage className="object-cover" src={ach.badge} />
                    )}
                    <AvatarFallback className="border border-muted-foreground rounded-full">
                      {<ImageOff className="w-4 h-4 text-muted-foreground" />}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-muted-foreground">{ach.title}</p>
                </PopoverTrigger>
                <PopoverContent className="rounded-xl">
                  <div className="flex gap-4 items-center">
                    <Avatar className="w-20 h-20 max-sm:w-16 max-sm:h-16">
                      {ach.badge && (
                        <AvatarImage className="object-cover" src={ach.badge} />
                      )}
                      <AvatarFallback>
                        {<ImageOff className="w-4 h-4 text-muted-foreground" />}
                      </AvatarFallback>
                    </Avatar>
                    <p className="w-full text-sm text-muted-foreground">
                      {ach.description}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
      </div>
    </div>
  );
};
