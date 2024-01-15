"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TCustomers } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { locale } from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const CustomersComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: customers, isFetching } = useQuery<TCustomers>({
    queryKey: [`/customers`, page, search],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/customers?page=${page}&search=${search}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={t("customers")} className="flex w-full">
      <DataTable
        columns={columns}
        data={customers?.data ?? []}
        isFetching={isFetching}
        meta={customers?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
        onSearch={(q) => setSearch(q)}
      />
    </DashboardSection>
  );
};
