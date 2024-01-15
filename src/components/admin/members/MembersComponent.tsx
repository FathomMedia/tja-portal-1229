"use client";

import React, { useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CustomersComponent } from "./customers/CustomersComponent";
import { AdminComponent } from "./administrators/AdminComponent";
import { useLocale, useTranslations } from "next-intl";
import { isRtlLang } from "rtl-detect";

export const MembersComponent = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (pairs: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams);
      pairs.forEach(({ name, value }) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex w-full">
      <Tabs
        dir={isRtlLang(locale) ? "rtl" : "ltr"}
        value={searchParams.get("type") ?? "customers"}
        onValueChange={(val) => {
          push(
            pathname + "?" + createQueryString([{ name: "type", value: val }])
          );
        }}
        defaultValue={searchParams.get("type") ?? "customers"}
        className="w-full gap-3 flex-col flex"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="customers">{t("customers")}</TabsTrigger>
          <TabsTrigger value="admins">{t("admins")}</TabsTrigger>
        </TabsList>
        <TabsContent value="customers">
          <CustomersComponent />
        </TabsContent>
        <TabsContent value="admins">
          <AdminComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
