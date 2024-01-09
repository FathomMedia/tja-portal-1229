"use client";

import { useTranslations } from "next-intl";

import { LevelsForm } from "@/components/admin/JourneysMiles/levels/LevelsForm";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <div className="max-w-4xl flex flex-col gap-10 pb-20">
      <div>
        <h2 className="text-2xl text-primary  font-helveticaNeue font-black  border-s-4 border-primary ps-2">
          {t("newLevel")}
        </h2>
      </div>
      <LevelsForm />
    </div>
  );
}
