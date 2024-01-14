"use client";

import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAddon } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const AddOnListComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Products");

  const { data: addOnList, isFetching } = useQuery<TAddon[]>({
    queryKey: [`/add-ons`],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/add-ons`,
        locale,
      }).then((res) => res.json().then((jsonData) => jsonData.data)),
  });

  return (
    <DashboardSection title={t("addOns")} className="flex w-full">
      <DataTable
        columns={columns}
        data={addOnList ?? []}
        isFetching={isFetching}
      />
    </DashboardSection>
  );
};
