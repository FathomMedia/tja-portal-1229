"use client";

import React, { useCallback } from "react";
import { CouponsListComponent } from "./coupons/CouponsListComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ConsultationListComponent } from "./levels/ConsultationOrdersComponent";

export const JourneysMilesComponent = () => {
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
        value={searchParams.get("type") ?? "coupons"}
        onValueChange={(val) => {
          push(
            pathname + "?" + createQueryString([{ name: "type", value: val }])
          );
        }}
        defaultValue={searchParams.get("type") ?? "coupons"}
        className="w-full gap-3 flex-col flex"
      >
        <TabsList className="w-fit">
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="levels">Levels</TabsTrigger>
        </TabsList>
        <TabsContent value="coupons">
          <CouponsListComponent />
        </TabsContent>
        <TabsContent value="levels">
          <ConsultationListComponent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
