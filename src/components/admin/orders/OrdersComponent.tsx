"use client";

import React from "react";
import { useLocale } from "next-intl";
import { AdventureOrdersComponent } from "./adventures/AdventureOrdersComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OrdersComponent = () => {
  const locale = useLocale();

  return (
    <div className="flex w-full">
      <Tabs defaultValue="adventures" className="w-full gap-3 flex-col flex">
        <TabsList className="w-fit">
          <TabsTrigger value="adventures">Adventures</TabsTrigger>
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
        </TabsList>
        <TabsContent value="adventures">
          <AdventureOrdersComponent />
        </TabsContent>
        <TabsContent value="consultation">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
};
