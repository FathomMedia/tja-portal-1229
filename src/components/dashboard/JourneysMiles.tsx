"use client";
import React, { FC, use } from "react";
import { DashboardSection } from "@/components/DashboardSection";

import { useLocale, useTranslations } from "next-intl";

import { TLevel, TUser } from "@/lib/types";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TJourneysMiles = {
  user: TUser;
  levels: TLevel[];
};

export const JourneysMiles: FC<TJourneysMiles> = ({ user, levels }) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  console.log(levels);

  return (
    <DashboardSection className="flex flex-col gap-4" title={t("journeysMiles")}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
          <p className="text-sm">{t("availablePoints")}</p>
          <p className="text-xl">{user?.points}</p>
        </div>
        {/* <div className="p-4 flex flex-col gap-2 rounded-lg border border-muted">
          <p>{user?.points}</p>
        </div> */}
        <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
          <div className="flex gap-4 items-center">
            <div className="relative aspect-square w-14 min-w-fit ">
              {user?.level.badge && (
                <Image
                  className="w-full h-full object-cover rounded-full"
                  fill
                  src={user?.level.badge}
                  alt="Badge"
                />
              )}
            </div>
            <div className="flex flex-col">
              <p className="w-full text-sm text-primary">{t("level")}</p>
              <p className="w-full text-sm text-muted-foreground">
                {user?.level.name}
              </p>
            </div>
          </div>
        </div>
      </div>
      <LevelsTable levels={levels} userLevelId={user.level.id} />
    </DashboardSection>
  );
};

export const LevelsTable = ({
  levels,
  userLevelId,
}: {
  levels: TLevel[];
  userLevelId: number;
}) => {

  const t = useTranslations("Dashboard");
  
  return (
    <Table className="bg-card rounded-2xl overflow-clip">
      <TableCaption>{t("theJourneyMilesLevels")}</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-card">
          <TableHead className="w-fit text-start text-primary">{t("level")}</TableHead>
          <TableHead className=" text-center text-primary">
            {t("minimumDays")}
          </TableHead>
          <TableHead className=" text-center text-primary">
            {t("maximumDays")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {levels.map((level, i) => (
          <TableRow
            key={i}
            className={cn(
              level.id === userLevelId &&
                "bg-primary text-primary-foreground hover:bg-primary/80"
            )}
          >
            <TableCell className="font-medium">{level.name}</TableCell>
            <TableCell className="text-center">{level.minDays}</TableCell>
            <TableCell className="text-center">{level.maxDays}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
