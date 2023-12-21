import { SidebarNav } from "@/components/SideNav";
import { Separator } from "@/components/ui/separator";
import { UserProfilePreview } from "@/components/user/UserProfilePreview";
import { useLocale, useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();

  var sidebarNavItems = [
    {
      title: t("home"),
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
      title: t("getInTouch"),
      href: `https://thejourneyadventures.com/get-in-touch`,
    },
  ];

  return (
    <div>
      <div className="space-y-6 p-4 md:p-10 pb-16">
        <UserProfilePreview items={sidebarNavItems} />
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:gap-6 lg:space-y-0">
          <aside className="-px-4 hidden lg:flex lg:w-1/5 overflow-x-scroll">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
