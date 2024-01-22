"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";

interface MobileNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string;
    title: string;
  }[];
  onNavigate: () => void;
  actions?: ReactNode | undefined;
}

export function MobileNav({
  className,
  items,
  onNavigate,
  actions,
  ...props
}: MobileNavProps) {
  const pathname = usePathname();
  const locale = useLocale();
  const { push } = useRouter();
  const t = useTranslations("Home");
  const queryClient = useQueryClient();

  async function logOut() {
    const res = await fetch("/api/authentication/logout", {
      headers: {
        "Accept-Language": locale,
      },
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      queryClient.invalidateQueries();
      push(`/${locale}/authentication`);
    } else {
      toast.error(data.message);
    }
  }
  return (
    <nav
      className={cn("flex flex-col gap-4 items-start", className)}
      {...props}
    >
      {actions}
      {items.map((item, i) => (
        <div onClick={onNavigate} key={item.href}>
          <Link
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
        </div>
      ))}
      <Button
        variant={"ghost"}
        className="hover:underline hover:bg-transparent justify-start"
        onClick={() => {
          logOut().then(() => {
            onNavigate();
          });
        }}
      >
        {t("logout")}
      </Button>
    </nav>
  );
}
