"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAdmins } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const AdminComponent = () => {
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const { data: admins, isFetching } = useQuery<TAdmins>({
    queryKey: [`/admins`, page],
    queryFn: () =>
      apiReqQuery({ endpoint: `/admins?page=${page}`, locale }).then((res) =>
        res.json()
      ),
  });

  return (
    <DashboardSection title={"Admins"} className="flex w-full">
      <DataTable
        columns={columns}
        data={admins?.data ?? []}
        isFetching={isFetching}
        meta={admins?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
      />
    </DashboardSection>
  );
};
