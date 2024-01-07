"use client";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAchievements } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const AchievementsListComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const { data: achievements, isFetching } = useQuery<TAchievements>({
    queryKey: [`/achievements`],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/achievements`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={t("achievements")} className="flex w-full">
      <DataTable
        columns={columns}
        data={achievements?.data ?? []}
        isFetching={isFetching}
      />
    </DashboardSection>
  );
};
