"use client";

import React, { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

import { usePathname, useParams, useRouter } from "next/navigation";
import { availableLocales } from "@/config";
import { useTranslations } from "next-intl";

export const LanguageSwitcher: FC = () => {
  const t = useTranslations("Home");

  const path = usePathname();
  const params = useParams();
  const router = useRouter();

  /**
   * The function `changeLanguage` takes a locale as input and updates the path in the router to include
   * the new locale if it matches one of the supported locales.
   * @param {string} locale - The `locale` parameter is a string that represents the desired language or
   * locale to change to.
   */
  function changeLanguage(locale: string) {
    const regex = new RegExp(`^/(${availableLocales.join("|")})`);
    const matchedLocale = path.match(regex);
    if (matchedLocale) {
      const updatedPath = path.replace(matchedLocale[0], `/${locale}`);
      router.push(updatedPath);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={"icon"}
          className="border-primary min-w-fit h-10 w-10"
        >
          <Globe />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 hover:bg-white flex flex-col">
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableLocales.map((l, i) => {
          let languageNames = new Intl.DisplayNames([l], { type: "language" });

          return (
            <DropdownMenuItem asChild key={i}>
              <Button
                variant={"ghost"}
                disabled={l === params.locale}
                onClick={() => changeLanguage(l)}
                className={cn(
                  "w-full justify-start menuitem disabled:bg-primary disabled:opacity-100 disabled:text-primary-foreground"
                )}
              >
                {languageNames.of(l)}
              </Button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
