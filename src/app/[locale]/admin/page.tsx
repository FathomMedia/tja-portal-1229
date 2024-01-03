import { DashboardSection } from "@/components/DashboardSection";
import { LatestsOrdersComponent } from "@/components/admin/latests-orders/LatestsOrdersComponent";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <DashboardSection title={t("home")}>
      <LatestsOrdersComponent />
    </DashboardSection>
  );
}
