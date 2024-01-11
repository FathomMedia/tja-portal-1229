"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAdventureBookings } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const AdventureOrdersComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  const [page, setPage] = useState(1);
  const { data: adventureOrders, isFetching } = useQuery<TAdventureBookings>({
    queryKey: [`/profile/adventure-bookings`, page],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/profile/adventure-bookings?page=${page}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={t("adventureOrders")} className="flex w-full">
      <DataTable
        columns={columns}
        data={adventureOrders?.data ?? []}
        isFetching={isFetching}
        meta={adventureOrders?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
      />
    </DashboardSection>
  );
};
