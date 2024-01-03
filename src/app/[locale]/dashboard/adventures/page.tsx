"use client";
import { TPaginatedAdventures } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSection } from "@/components/DashboardSection";

export default function Page() {
  const locale = useLocale();

  const t = useTranslations("Adventures");

  const {
    data: paginatedAdventures,
    isFetching: isFetchingPaginatedAdventures,
  } = useQuery<TPaginatedAdventures>({
    queryKey: ["/adventures"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/adventures", locale }).then((res) =>
        res.json().then((resData) => {
          return resData;
        })
      ),
  });

  return (
    <DashboardSection title={t("adventures")} className="flex flex-col gap-2">
      {isFetchingPaginatedAdventures && (
        <>
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
          <Skeleton className="w-full h-40" />
        </>
      )}
      {paginatedAdventures &&
        !isFetchingPaginatedAdventures &&
        paginatedAdventures.data.map((adventure, i) => (
          <Link href={`adventures/${adventure.slug}`} key={i}>
            <div className="w-full p-5 bg-white flex items-end gap-4 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="grow">
                <div>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <p>{adventure.title}</p>
                  </h5>
                </div>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {adventure.description}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {adventure.country}
                </p>
                <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#1E473F] rounded-lg hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  {t("discover")}
                </div>
              </div>
              <div>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {adventure.priceWithCurrency}
                </p>
              </div>
            </div>
          </Link>
        ))}
      {!paginatedAdventures && !isFetchingPaginatedAdventures && (
        <div className="text-center text-muted-foreground bg-muted p-4 rounded-md">
          <p>Failed to retrieve adventures</p>
        </div>
      )}
    </DashboardSection>
  );
}
