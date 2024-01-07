"use client";

import React, { useCallback } from "react";
import { AdventureListComponent } from "./adventures/AdventureListComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConsultationListComponent } from "./consultation/ConsultationListComponent";

export const ProductsComponent = () => {
  const { push } = useRouter();
  const pathname = usePathname();

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
          <TabsTrigger value="adventures">Adventures</TabsTrigger>
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
        </TabsList>
        <TabsContent value="adventures">
          <AdventureListComponent />
        </TabsContent>
        <TabsContent value="consultation">
          <ConsultationListComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
