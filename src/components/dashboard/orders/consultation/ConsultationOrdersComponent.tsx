"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TConsultationBookings } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const ConsultationOrdersComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const [page, setPage] = useState(1);
  // TODO: change to Consultation
  const { data: consultationOrders, isFetching } =
    useQuery<TConsultationBookings>({
      queryKey: [`/profile/consultation-bookings`, page],
      queryFn: () =>
        apiReqQuery({
          endpoint: `/profile/consultation-bookings?page=${page}`,
          locale,
        }).then((res) => res.json()),
    });

  return (
    <DashboardSection title={t("consultationOrders")} className="flex w-full">
      <DataTable
        columns={columns}
        data={consultationOrders?.data ?? []}
        isFetching={isFetching}
        meta={consultationOrders?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
      />
    </DashboardSection>
  );
};
