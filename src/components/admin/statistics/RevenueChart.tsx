"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { apiReqQuery } from "@/lib/apiHelpers";
import { TStatisticsRevenueChart } from "@/lib/statisticsTypes";
import { cn, formatePrice } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import React, { useMemo } from "react";
import { AxisOptions, Chart } from "react-charts";

type Series = {
  label: string;
  data: TStatisticsRevenueChart[];
};

export const RevenueChart = () => {
  const locale = useLocale();
  const t = useTranslations();

  const { data: statistics, isFetching } = useQuery<TStatisticsRevenueChart[]>({
    queryKey: [`/statistics/revenue-bar-chart`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/statistics/revenue-bar-chart`, locale }).then(
        (res) => res.json().then((jsonData) => jsonData.data)
      ),
  });

  const data: Series[] = [
    {
      label: "Monthly Revenue",
      data: statistics ?? [],
    },
  ];

  const primaryAxis = useMemo(
    (): AxisOptions<TStatisticsRevenueChart> => ({
      getValue: (datum) => `${datum.year} - ${datum.month}`,
    }),
    []
  );

  const secondaryAxes = React.useMemo(
    (): AxisOptions<TStatisticsRevenueChart>[] => [
      {
        getValue: (datum) => datum.revenue,
        elementType: "area",
      },
    ],
    []
  );

  return (
    <div className="w-full h-full relative min-h-[10rem] xl:min-h-[14rem]">
      {isFetching && (
        <Skeleton className={cn("w-full h-full z-10 absolute inset-0")} />
      )}
      {!isFetching && statistics && statistics.length > 0 && (
        <Chart
          dir="ltr"
          className={cn(
            "opacity-100 duration-200 w-full h-full ",
            isFetching && "opacity-0"
          )}
          options={{
            data,
            primaryAxis,
            secondaryAxes,
            defaultColors: ["#E06132"],
          }}
        />
      )}
      {!isFetching && statistics && statistics.length == 0 && (
        <div
          className={cn(
            "flex flex-col px-6 sm:px-10 md:px-12 lg:px-20 text-center bg-default-50 border-default-200 border rounded-medium",
            "gap-1 md:gap-2",
            "py-10 sm:py-14"
          )}
        >
          <h2
            className={cn(
              "font-bold text-default-700 text-center mb-2 md:text-xl"
            )}
          >
            {t("no-data")}
          </h2>
          <p className={cn("text-default-400 text-center text-pretty")}>
            {t("noDataDescription")}
          </p>
        </div>
      )}
    </div>
  );
};
