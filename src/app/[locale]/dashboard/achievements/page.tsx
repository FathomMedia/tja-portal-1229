import { DashboardSection } from "@/components/DashboardSection";
import { MyAchievements } from "@/components/user/MyAchievements";
import { useAppContext } from "@/contexts/AppContext";
import { getMyAchievements } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type } from "os";
import { useState } from "react";

import toast from "react-hot-toast";

export type TAchievement = {
  id: number;
  title: string;
  description: string;
  badge: string;
  achieved: boolean;
};

export default async function Page() {
  const locale = useLocale();
  const t = await getTranslations("Dashboard");

  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const achievements: TAchievement[] = await getMyAchievements({
    locale,
    token: token?.value,
  });

  return (
    <DashboardSection title={t("MyAchievements")}>
      <MyAchievements achievements={achievements} />
    </DashboardSection>
  );
}
