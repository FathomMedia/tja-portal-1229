"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TConsultations } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const ConsultationListComponent = () => {
  const locale = useLocale();

  const [page, setPage] = useState(1);
  // TODO: change to Consultation
  const { data: consultationList, isFetching } = useQuery<TConsultations>({
    queryKey: [`/consultations`, page],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/consultations?page=${page}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={"Consultations"} className="flex w-full">
      <DataTable
        columns={columns}
        data={consultationList?.data ?? []}
        isFetching={isFetching}
        meta={consultationList?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
      />
    </DashboardSection>
  );
};
