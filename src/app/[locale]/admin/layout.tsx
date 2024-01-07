"use client";

import { SidebarNav } from "@/components/SideNav";
import { Separator } from "@/components/ui/separator";
import { UserProfilePreview } from "@/components/user/UserProfilePreview";

import { useLocale, useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  const t = useTranslations("Dashboard");

  const sidebarNavItems = [
    {
      title: t("home"),
      href: `/${locale}/admin`,
    },

    {
      title: t("journeysMiles"),
      href: `/${locale}/admin/journeys-miles`,
    },
    {
      title: t("orders"),
      href: `/${locale}/admin/orders`,
    },
    {
      title: t("products"),
      href: `/${locale}/admin/products`,
    },
    {
      title: t("achievements"),
      href: `/${locale}/admin/achievements`,
    },
    {
      title: t("customers"),
      href: `/${locale}/admin/customers`,
    },
    {
      title: t("accountDetails"),
      href: `/${locale}/admin/account-details`,
    },
  ];

  return (
    <div className="h-screen flex flex-col">
      <div className="space-y-6 p-4 md:p-10 pb-16 flex flex-col h-full">
        <UserProfilePreview items={sidebarNavItems} />
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:gap-6 lg:space-y-0">
          <aside className="-px-4 hidden lg:flex lg:w-1/5 overflow-x-scroll">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="grow lg:max-w-[80%]">{children}</div>
        </div>
      </div>
    </div>
  );
}
