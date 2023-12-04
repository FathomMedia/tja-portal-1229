import Image from "next/image";
import React, { FC } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { TAchievement } from "@/lib/types";
type TMyAchievements = {
  achievements: TAchievement[];
};
export const MyAchievements: FC<TMyAchievements> = ({ achievements }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
      {achievements.map((ach, i) => (
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
