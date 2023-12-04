"use client";
import { SidebarNav } from "@/components/SideNav";
import { Separator } from "@/components/ui/separator";
import { UserProfilePreview } from "@/components/user/UserProfilePreview";
import { useAppContext } from "@/contexts/AppContext";
import { useLocale, useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
   
  const t = useTranslations("Dashboard");
  const { user } = useAppContext();
  const locale = useLocale();
 

  var sidebarNavItems = [
    {
      title: t("myAccount"),
      href: `/${locale}/dashboard`,
    },
    {
      title: t("myJourneys"),
      href: `/${locale}/dashboard/journeys`,
    },
    {
      title: t("journeysMiles"),
      href: `/${locale}/dashboard/journeys-miles`,
    },
    {
      title: t("myAchievements"),
      href: `/${locale}/dashboard/achievements`,
    },
    {
      title: t("accountDetails"),
      href: `/${locale}/dashboard/account-details`,
    },
  ];

  return (
    <div>
      <div className="space-y-6 p-4 md:p-10 pb-16 ">
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
