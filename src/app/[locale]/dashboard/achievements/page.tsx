import { DashboardSection } from "@/components/DashboardSection";
import { MyAchievements } from "@/components/user/MyAchievements";
import { getToken } from "@/lib/serverUtils";
import { TAchievement } from "@/lib/types";
import { apiReq } from "@/lib/apiHelpers";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const locale = useLocale();
  const t = await getTranslations("Dashboard");
  const token = getToken();

  async function getMyAchievements() {
    const res = await apiReq({
      endpoint: "/profile/achievements",
      locale: locale,
      token,
    });

    if (res.ok) {
      const { data } = await res.json();
      return data as TAchievement[];
    }

    return [];
  }

  const achievements = await getMyAchievements();

  return (
    <DashboardSection className="max-w-4xl" title={t("MyAchievements")}>
      <MyAchievements achievements={achievements} />
    </DashboardSection>
  );
}
