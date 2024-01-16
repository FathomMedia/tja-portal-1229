import { DashboardSection } from "@/components/DashboardSection";
import { DashboardStatistics } from "@/components/admin/statistics/DashboardStatistics";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <DashboardSection hideBack title={t("statistics")} className="pb-16">
      <DashboardStatistics />
    </DashboardSection>
  );
}
