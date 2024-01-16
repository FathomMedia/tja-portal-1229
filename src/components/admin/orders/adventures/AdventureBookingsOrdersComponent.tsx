"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAdventureBookings } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const AdventureBookingsOrdersComponent = ({
  slug,
}: {
  slug: string;
}) => {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: adventureOrders, isFetching } = useQuery<TAdventureBookings>({
    queryKey: [`/adventure-bookings/${slug}`, page, search],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/adventure-bookings/${slug}?page=${page}&search=${search}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DataTable
      columns={columns}
      data={adventureOrders?.data ?? []}
      isFetching={isFetching}
      meta={adventureOrders?.meta ?? null}
      onPageSelect={(goTO) => setPage(goTO)}
      onSearch={(q) => setSearch(q)}
    />
  );
};
