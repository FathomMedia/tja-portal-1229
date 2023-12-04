"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const { push } = useRouter();
  const t = useTranslations("Home");

  async function LogOut() {
    const res = await fetch("/api/authentication/logout", {
      headers: {
        "Accept-Language": locale,
      },
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      push(`/${locale}/authentication`);
    } else {
      toast.error(data.message);
    }
  }
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname.startsWith(item.href) && i != 0
              ? "bg-muted hover:bg-muted"
              : pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
      <Button
        variant={"ghost"}
        className="hover:underline hover:bg-transparent justify-start"
        onClick={LogOut}
      >
        {t("logout")}
      </Button>
    </nav>
  );
}
