import { DashboardSection } from "@/components/DashboardSection";
import { MyAchievements } from "@/components/user/MyAchievements";
import { getMyAchievements } from "@/lib/apiHelpers";
import { getToken } from "@/lib/serverUtils";
import { TAchievement } from "@/lib/types";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const locale = useLocale();
  const t = await getTranslations("Dashboard");
  const token = getToken();
  const achievements: TAchievement[] = await getMyAchievements({
    locale,
    token: token,
  });

  return (
    <DashboardSection title={t("MyAchievements")}>
      <MyAchievements achievements={achievements} />
    </DashboardSection>
  );
}
