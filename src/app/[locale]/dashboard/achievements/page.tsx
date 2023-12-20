import { DashboardSection } from "@/components/DashboardSection";
import { MyAchievements } from "@/components/user/MyAchievements";
import { useLocale, useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Dashboard");

  return (
    <DashboardSection className="max-w-4xl" title={t("MyAchievements")}>
      <MyAchievements />
    </DashboardSection>
  );
}
