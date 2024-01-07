"use client";

import { useLocale, useTranslations } from "next-intl";

import { CouponsForm } from "@/components/admin/JourneysMiles/coupons/CouponsForm";

export default function Page() {
  const t = useTranslations("Coupons");

  return (
    <div className="max-w-4xl flex flex-col gap-10 pb-20">
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          {t("newCoupon")}
        </h2>
      </div>
      <CouponsForm />
    </div>
  );
}
