"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAdventure, TAdventureBookings, TAdventures } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const AdventureListComponent = () => {
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const { data: adventure, isFetching } = useQuery<TAdventures>({
    queryKey: [`/adventures`, page],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/adventures?page=${page}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={"Adventures"} className="flex w-full">
      <DataTable
        columns={columns}
        data={adventure?.data ?? []}
        isFetching={isFetching}
        meta={adventure?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
      />
    </DashboardSection>
  );
};
