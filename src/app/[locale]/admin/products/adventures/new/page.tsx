"use client";
import { AdventureForm } from "@/components/admin/products/adventures/AdventureForm";
import { TAddon, TCountry } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSection } from "@/components/DashboardSection";

export default function Page() {
  const locale = useLocale();

  const t = useTranslations("Adventures");

  const { data: countries, isFetching: isFetchingCountries } = useQuery<
    TCountry[]
  >({
    queryKey: [`/countries`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/countries`, locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
    staleTime: Infinity,
  });
  const { data: addons, isFetching: isFetchingAddons } = useQuery<TAddon[]>({
    queryKey: [`/add-ons`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/add-ons`, locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
    staleTime: Infinity,
  });

  return (
    <DashboardSection
      title={t("newAdventure")}
      className="max-w-4xl flex flex-col gap-10 pb-20"
    >
      {(isFetchingCountries || isFetchingAddons) && (
        <Skeleton className="w-full h-96" />
      )}
      {countries && addons && !isFetchingCountries && !isFetchingAddons && (
        <AdventureForm countries={countries} addons={addons} />
      )}
    </DashboardSection>
  );
}
