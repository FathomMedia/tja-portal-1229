"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TConsultationBookings } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";
import Link from "next/link";
import { api } from "@/config";
import { Button } from "@/components/ui/button";

export const ConsultationOrdersComponent = () => {
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
    <DashboardSection
      title={"Consultation Orders"}
      className="flex flex-col w-full"
    >
      <Button
        onClick={() =>
          apiReqQuery({
            endpoint: `/consultation-bookings/export`,
            method: "GET",
            locale,
          }).then(async (res) => {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "consultation-bookings.csv";
            a.click();
            window.URL.revokeObjectURL(url);
          })
        }
      >
        Download CSV
      </Button>
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
