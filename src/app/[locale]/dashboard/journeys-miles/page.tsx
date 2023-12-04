"use client";

import { DashboardSection } from "@/components/DashboardSection";
import { MyAchievements } from "@/components/user/MyAchievements";
import { useAppContext } from "@/contexts/AppContext";
import { getMyAchievements } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import { cookies } from "next/headers";

import Image from "next/image";

export default function Page() {
  const locale = useLocale();
  const { user } = useAppContext();
  const t = useTranslations("Dashboard");

  return (
    <DashboardSection title={"Journeys Miles"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
          <p className="text-sm">{t("availablePoints")}</p>
          <p className="text-xl">{user?.points}</p>
        </div>
        {/* <div className="p-4 flex flex-col gap-2 rounded-lg border border-muted">
          <p>{user?.points}</p>
        </div> */}
        <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
          <div className="flex gap-4 items-center">
            <div className="relative aspect-square w-14 min-w-fit ">
              {user?.level.badge && (
                <Image
                  className="w-full h-full object-cover rounded-full"
                  fill
                  src={user?.level.badge}
                  alt="Badge"
                />
              )}
            </div>
            <div className="flex flex-col">
              <p className="w-full text-sm text-primary">{t("level")}</p>
              <p className="w-full text-sm text-muted-foreground">
                {user?.level.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
