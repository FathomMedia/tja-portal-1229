"use client";

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
  );
}
