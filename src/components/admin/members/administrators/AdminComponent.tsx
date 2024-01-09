"use client";

import React, { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TAdminInvitations, TAdmins } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";
import { columnsAdminInvitations } from "./columns-admin-invitations";

export const AdminComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const [page, setPage] = useState(1);
  const { data: admins, isFetching } = useQuery<TAdmins>({
    queryKey: [`/admins`, page],
    queryFn: () =>
      apiReqQuery({ endpoint: `/admins?page=${page}`, locale }).then((res) =>
        res.json()
      ),
  });

  const { data: adminInvitations, isFetching: isFetchingInvitation } =
    useQuery<TAdminInvitations>({
      queryKey: [`/admins/invitations`, page],
      queryFn: () =>
        apiReqQuery({
          endpoint: `/admins/invitations?page=${page}`,
          locale,
        }).then((res) => res.json()),
    });

  return (
    <DashboardSection title={t("admins")} className="flex w-full">
      <div className=" flex flex-col">
        <DataTable
          columns={columns}
          data={admins?.data ?? []}
          isFetching={isFetching}
          meta={admins?.meta ?? null}
          onPageSelect={(goTO) => setPage(goTO)}
        />

        <div className=" my-[3rem]">
          <h2 className="text-2xl text-primary font-black font-helveticaNeue border-s-4 border-primary ps-2 my-4">
            Sent invitations
          </h2>
          <DataTable
            columns={columnsAdminInvitations}
            data={adminInvitations?.data ?? []}
            isFetching={isFetchingInvitation}
            meta={adminInvitations?.meta ?? null}
            onPageSelect={(goTO) => setPage(goTO)}
          />
        </div>
      </div>
    </DashboardSection>
  );
};
