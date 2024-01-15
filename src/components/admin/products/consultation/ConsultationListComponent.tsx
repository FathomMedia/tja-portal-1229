"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TConsultations } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const ConsultationListComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Products");

  const [page, setPage] = useState(1);

  const [tier, setTier] = useState("");

  var filterTier = tier !== "" ? `&tier=${tier}` : "";

  const { data: consultationList, isFetching } = useQuery<TConsultations>({
    queryKey: [`/consultations`, page, tier],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/consultations?page=${page}${filterTier}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={t("consultations")} className="flex w-full">
      <DataTable
        columns={columns}
        data={consultationList?.data ?? []}
        isFetching={isFetching}
        meta={consultationList?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
        onTier={(tie) => setTier(tie)}
      />
    </DashboardSection>
  );
};
