"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TCustomers } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { locale } from "dayjs";
import { useLocale } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const CustomersComponent = () => {
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const { data: customers, isFetching } = useQuery<TCustomers>({
    queryKey: [`/customers`, page],
    queryFn: () =>
      apiReqQuery({ endpoint: `/customers?page=${page}`, locale }).then((res) =>
        res.json()
      ),
  });

  return (
    <DashboardSection title={"Customers"} className="flex w-full">
      <DataTable
        columns={columns}
        data={customers?.data ?? []}
        isFetching={isFetching}
        meta={customers?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
      />
    </DashboardSection>
  );
};
