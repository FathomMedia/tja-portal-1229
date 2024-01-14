"use client";

import React, { useCallback } from "react";
import { AdventureListComponent } from "./adventures/AdventureListComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConsultationListComponent } from "./consultation/ConsultationListComponent";
import { useLocale, useTranslations } from "next-intl";
import { AddOnListComponent } from "./add-ons/AddOnListComponent";
import { isRtlLang } from "rtl-detect";

export const ProductsComponent = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Products");

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
          <TabsTrigger value="consultation">{t("consultations")}</TabsTrigger>
          <TabsTrigger value="addOns">{t("addOns")}</TabsTrigger>
        </TabsList>
        <TabsContent value="adventures">
          <AdventureListComponent />
        </TabsContent>
        <TabsContent value="consultation">
          <ConsultationListComponent />
        </TabsContent>
        <TabsContent value="addOns">
          <AddOnListComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
