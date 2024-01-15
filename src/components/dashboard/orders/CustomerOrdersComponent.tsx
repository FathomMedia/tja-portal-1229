"use client";

import React, { useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdventureOrdersComponent } from "./adventures/AdventureOrdersComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConsultationOrdersComponent } from "./consultation/ConsultationOrdersComponent";
import { isRtlLang } from "rtl-detect";

export const CustomerOrdersComponent = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Orders");
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
        value={searchParams.get("type") ?? "adventures"}
        onValueChange={(val) => {
          push(
            pathname + "?" + createQueryString([{ name: "type", value: val }])
          );
        }}
        defaultValue={searchParams.get("type") ?? "adventures"}
        className="w-full gap-3 flex-col flex"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="adventures">{t("adventures")}</TabsTrigger>
          <TabsTrigger value="consultation">{t("consultation")}</TabsTrigger>
        </TabsList>
        <TabsContent value="adventures">
          <AdventureOrdersComponent />
        </TabsContent>
        <TabsContent value="consultation">
          <ConsultationOrdersComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
