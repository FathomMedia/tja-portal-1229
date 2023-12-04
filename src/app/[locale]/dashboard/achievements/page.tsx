import { DashboardSection } from "@/components/DashboardSection";
import { MyAchievements } from "@/components/user/MyAchievements";
import { getMyAchievements } from "@/lib/apiHelpers";
import { TAchievement } from "@/lib/types";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export default async function Page() {
  const locale = useLocale();
  const t = await getTranslations("Dashboard");

  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const achievements: TAchievement[] = await getMyAchievements({
    locale,
    token: token?.value,
  });

  return (
    <DashboardSection title={t("MyAchievements")}>
      <MyAchievements achievements={achievements} />
    </DashboardSection>
  );
}
