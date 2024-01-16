import { DashboardSection } from "@/components/DashboardSection";
import { DashboardStatistics } from "@/components/admin/statistics/DashboardStatistics";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <div className="pb-16 flex flex-col gap-2">
      <p className="text-lg  font-semibold text-primary">{t("statistics")}</p>
      <DashboardStatistics />
    </div>
  );
}
