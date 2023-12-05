import { SidebarNav } from "@/components/SideNav";
import { Separator } from "@/components/ui/separator";
import { UserProfilePreview } from "@/components/user/UserProfilePreview";
import { getToken } from "@/lib/serverUtils";
import { apiReq } from "@/lib/utils";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Dashboard");
  const locale = useLocale();
  const token = getToken();

  const user = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token,
  }).then(async (val) => {
    const { data } = await val.json();
    return data;
  });

  var sidebarNavItems = [
    {
      title: t("myAccount"),
      href: `/${locale}/dashboard`,
    },
    {
      title: t("journeysMiles"),
      href: `/${locale}/dashboard/journeys-miles`,
    },
    {
      title: t("myOrders"),
      href: `/${locale}/dashboard/orders`,
    },
    {
      title: t("myAchievements"),
      href: `/${locale}/dashboard/achievements`,
    },
    {
      title: t("adventures"),
      href: `/${locale}/dashboard/adventures`,
    },
    {
      title: t("consultations"),
      href: `/${locale}/dashboard/consultations`,
    },
    {
      title: t("accountDetails"),
      href: `/${locale}/dashboard/account-details`,
    },
    {
      title: t("help"),
      href: `/${locale}/dashboard/help`,
    },
  ];

  return (
    <div>
      <div className="space-y-6 p-4 md:p-10 pb-16">
        <div className="space-y-0.5">
          {user && <UserProfilePreview user={user} />}
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:gap-6 lg:space-y-0">
          <aside className="-px-4 lg:w-1/5 overflow-x-scroll">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
