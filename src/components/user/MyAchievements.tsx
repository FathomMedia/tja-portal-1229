"use client";
import Image from "next/image";
import React, { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { TAchievement } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { Skeleton } from "../ui/skeleton";

export const MyAchievements: FC = () => {
  const locale = useLocale();

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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
      {isFetchingAchievements && (
        <>
          <Skeleton className="w-full h-40 max-w-xs" />
          <Skeleton className="w-full h-40 max-w-xs" />
          <Skeleton className="w-full h-40 max-w-xs" />
        </>
      )}
      {achievements &&
        !isFetchingAchievements &&
        achievements.map((ach, i) => (
          <Popover key={i}>
            <PopoverTrigger
              className={cn(
                "flex flex-col gap-2 rounded-xl bg-white border-2 border-muted justify-center items-center p-6",
                !ach.achieved && "bg-muted opacity-80"
              )}
            >
              <div className="relative aspect-square w-20 max-sm:w-16">
                <Image
                  className="w-full h-full object-cover rounded-full"
                  fill
                  src={ach.badge}
                  alt="Badge"
                />
              </div>
              <p className="text-sm text-muted-foreground">{ach.title}</p>
            </PopoverTrigger>
            <PopoverContent className="rounded-xl">
              <div className="flex gap-4 items-center">
                <div className="relative aspect-square w-20 min-w-fit max-sm:w-16">
                  <Image
                    className="w-full h-full object-cover rounded-full"
                    fill
                    src={ach.badge}
                    alt="Badge"
                  />
                </div>
                <p className="w-full text-sm text-muted-foreground">
                  {ach.description}
                </p>
              </div>
            </PopoverContent>
          </Popover>
        ))}
    </div>
  );
};
