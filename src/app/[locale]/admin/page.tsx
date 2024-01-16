import { DashboardStatistics } from "@/components/admin/statistics/DashboardStatistics";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <div className="pb-16">
      {/* <LatestsOrdersComponent /> */}
      <DashboardStatistics />
    </div>
  );
}
