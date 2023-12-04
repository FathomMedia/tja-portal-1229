"use client";

import { DashboardSection } from "@/components/DashboardSection";
import { MyAchievements } from "@/components/user/MyAchievements";
import { useAppContext } from "@/contexts/AppContext";
import { getMyAchievements } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import { cookies } from "next/headers";

export default function Page() {
  const locale = useLocale();
  const { user } = useAppContext();

  return (
    <DashboardSection title={"Journeys Miles"}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
          <p className="text-sm">Available points</p>
          <p className="text-xl">{user?.points}</p>
        </div>
        {/* <div className="p-4 flex flex-col gap-2 rounded-lg border border-muted">
          <p>{user?.points}</p>
        </div> */}
      </div>
    </DashboardSection>
  );
}
