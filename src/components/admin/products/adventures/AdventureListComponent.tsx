"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAdventures } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";

export const AdventureListComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Products");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");

  var filterGender = gender !== "" ? `&gender=${gender}` : "";

  const { data: adventure, isFetching } = useQuery<TAdventures>({
    queryKey: [`/adventures`, page, search, gender],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/adventures?page=${page}&search=${search}${filterGender}`,
        locale,
      }).then((res) => res.json()),
  });

  return (
    <DashboardSection title={t("adventures")} className="flex w-full">
      <DataTable
        columns={columns}
        data={adventure?.data ?? []}
        isFetching={isFetching}
        meta={adventure?.meta ?? null}
        onPageSelect={(goTO) => setPage(goTO)}
        onSearch={(q) => setSearch(q)}
        onGender={(gen) => setGender(gen)}
      />
    </DashboardSection>
  );
};

// ${country !== "" && `&country=${country}`}
