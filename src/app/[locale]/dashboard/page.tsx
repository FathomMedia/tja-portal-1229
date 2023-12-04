"use client";

import { DashboardSection } from "@/components/DashboardSection";
import { Button } from "@/components/ui/button";
import { UserProfilePreview } from "@/components/user/UserProfilePreview";
import { useAppContext } from "@/contexts/AppContext";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default function Page() {
  const locale = useLocale();
  const { refresh } = useRouter();
  const t = useTranslations("Home");

  const { user } = useAppContext();

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
      </div>
    </DashboardSection>
  );
}
