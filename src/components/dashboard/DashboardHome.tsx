"use client";

import { TUser } from "@/lib/types";
import React, { FC } from "react";
import { DashboardSection } from "../DashboardSection";
import { useTranslations } from "next-intl";

type TDashboardHome = {
  user: TUser;
};

export const DashboardHome: FC<TDashboardHome> = ({ user }) => {
  const t = useTranslations("Home");
  return (
    <DashboardSection title={"My Account"}>
      <div className=" flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex border-b divide-x">
            {/* Current Tier */}
            <div className=" flex p-4 flex-col">
              <p className="text-sm text-muted-foreground">Current Tier</p>
              <h2 className="text-2xl text-primary font-semibold">
                {user?.level.name}
              </h2>
            </div>
            {/* Days Travelled */}
            <div className=" flex p-4 flex-col">
              <p className="text-sm text-muted-foreground">Days Travelled</p>
              <h2 className="text-2xl text-primary font-semibold">{`${user?.daysTravelled} Days`}</h2>
            </div>
          </div>
          {/* Badge */}
          <div></div>
        </div>
        <div className="p-6 flex flex-col gap-4">
          {/* Up coming adventures */}
          <div className="bg-muted flex p-3 rounded-lg">
            <h1>{t("upComingAdventures")}</h1>
          </div>
          {/* Up coming adventures */}
          <div className="bg-muted flex p-3 rounded-lg">
            <h1>{t("latestsOrders")}</h1>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
};
