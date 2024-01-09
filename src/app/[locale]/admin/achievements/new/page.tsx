"use client";

import { useTranslations } from "next-intl";

import { AchievementsForm } from "@/components/admin/achievements/AchievementsForm";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <div className="max-w-4xl flex flex-col gap-10 pb-20">
      <div>
        <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
          {t("newAchievement")}
        </h2>
      </div>
      <AchievementsForm />
    </div>
  );
}
