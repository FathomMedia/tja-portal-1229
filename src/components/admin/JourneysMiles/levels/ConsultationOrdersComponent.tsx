"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TConsultationBookings } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const ConsultationListComponent = () => {
  const locale = useLocale();

  const [page, setPage] = useState(1);
  // TODO: change to Consultation
  const { data: consultationOrders, isFetching } =
    useQuery<TConsultationBookings>({
      queryKey: [`/consultation-bookings`, page],
      queryFn: () =>
        apiReqQuery({
          endpoint: `/consultation-bookings?page=${page}`,
          locale,
        }).then((res) => res.json()),
    });

  return (
    <DashboardSection title={"Consultation Orders"} className="flex w-full">
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
