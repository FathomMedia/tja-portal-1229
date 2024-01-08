"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TCoupons } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const CouponsListComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Coupons");

  const [page, setPage] = useState(1);
  const { data: coupons, isFetching } = useQuery<TCoupons>({
    queryKey: [`/coupons`, page],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/coupons?page=${page}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={t("Coupons")} className="flex w-full">
      <DataTable
        columns={columns}
        data={coupons?.data ?? []}
        isFetching={isFetching}
        meta={coupons?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
      />
    </DashboardSection>
  );
};
