"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TCoupons, TLevel, TLevels } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const LevelsListComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const { data: levels, isFetching } = useQuery<TLevels>({
    queryKey: [`/levels`],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/levels`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={t("levels")} className="flex w-full">
      <DataTable
        columns={columns}
        data={levels?.data ?? []}
        isFetching={isFetching}
      />
    </DashboardSection>
  );
};
