"use client";
import React, { FC, PropsWithChildren } from "react";
import { RevenueChart } from "./RevenueChart";
import { LatestsOrdersComponent } from "../latests-orders/LatestsOrdersComponent";
import { TStatistics } from "@/lib/statisticsTypes";
import { useQuery } from "@tanstack/react-query";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatePrice } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRight,
  ImageOff,
  Map,
  Plane,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export const DashboardStatistics = () => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const { data: statistics, isFetching } = useQuery<TStatistics>({
    queryKey: [`/statistics`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/statistics`, locale }).then((res) =>
        res.json().then((jsonData) => jsonData?.data)
      ),
  });

  return (
    <div className="flex flex-col gap-4 xl:gap-6 w-full">
      {/* row of status */}
      {isFetching && (
        <div className="grid gap-4 xl:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="rounded-lg min-h-[8rem]"></Skeleton>
          <Skeleton className="rounded-lg min-h-[8rem]"></Skeleton>
          <Skeleton className="rounded-lg min-h-[8rem]"></Skeleton>
          <Skeleton className="rounded-lg min-h-[8rem]"></Skeleton>
        </div>
      )}
      {!isFetching && statistics && (
        <div className="grid gap-4 xl:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatisticsCard>
            <div className="flex items-center justify-between">
              <StatisticsHeader>{t("estimatedTotalRevenue")}</StatisticsHeader>
              <p className="text-sm text-muted-foreground">BHD</p>
            </div>
            <StatisticsValue>
              {formatePrice({
                locale,
                price: statistics.estimatedTotalRevenue,
              })}
            </StatisticsValue>
          </StatisticsCard>

          <StatisticsCard>
            <div className="flex items-center justify-between">
              <StatisticsHeader>{t("totalCustomers")}</StatisticsHeader>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <StatisticsValue>{statistics.totalCustomers}</StatisticsValue>
          </StatisticsCard>

          <StatisticsCard className="@container">
            <div className="flex items-center justify-between">
              <StatisticsHeader>{t("totalOrders")}</StatisticsHeader>
              <Plane className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2 @sm:flex-row">
              <div className="flex items-center gap-2 bg-muted/20 border p-2 justify-center rounded-sm w-full">
                <p className="text-primary text-sm">{t("adventures")}</p>
                <StatisticsValue>
                  {statistics.totalBookings.adventures}
                </StatisticsValue>
              </div>
              <div className="flex items-center gap-2 bg-muted/20 border p-2 justify-center rounded-sm w-full">
                <p className="text-primary text-sm">{t("consultations")}</p>
                <StatisticsValue>
                  {statistics.totalBookings.consultations}
                </StatisticsValue>
              </div>
            </div>
          </StatisticsCard>
          <StatisticsCard className="@container">
            <div className="flex items-center justify-between">
              <StatisticsHeader>{t("totalProducts")}</StatisticsHeader>
              <Map className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2  @sm:flex-row">
              <div className="flex items-center gap-2 bg-muted/20 border p-2 justify-center rounded-sm w-full">
                <p className="text-primary text-sm">{t("adventures")}</p>
                <StatisticsValue>
                  {statistics.totalProducts.adventures}
                </StatisticsValue>
              </div>
              <div className="flex items-center gap-2 bg-muted/20 border p-2 justify-center rounded-sm w-full">
                <p className="text-primary text-sm">{t("consultations")}</p>
                <StatisticsValue>
                  {statistics.totalProducts.consultations}
                </StatisticsValue>
              </div>
            </div>
          </StatisticsCard>
        </div>
      )}
      {/* grid of chart and recent orders */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4 xl:gap-6">
        {/* chart */}
        <div className="p-4 gap-3 col-span-1 xl:col-span-4 rounded-lg border-border border flex flex-col h-full">
          <p className="text-lg font-semibold text-primary">
            {t("monthlyRevenue")}
          </p>
          <RevenueChart />
          <p className="text-xs text-muted-foreground">{t("valuesAreInBHD")}</p>
        </div>
        {/* recent orders */}
        <div className="col-span-1 xl:col-span-3 rounded-lg border-border border flex flex-col h-full p-4 gap-3">
          <p className="text-lg font-semibold text-primary">
            {t("latestOrders")}
          </p>
          <LatestsOrdersComponent />
        </div>
      </div>
      {/* grid of top customers and adventures */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-6">
        <div className="p-4 gap-3 col-span-1 rounded-lg  @container border-border border flex flex-col h-full">
          <p className="text-lg font-semibold text-primary">
            {t("topCustomers")}
          </p>
          {isFetching && (
            <>
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </>
          )}
          {!isFetching &&
            statistics?.topCustomers.map((customer, i) => (
              <Link
                href={`/${locale}/admin/members/customers/edit/${customer.id}`}
                className="flex flex-col @md:flex-row gap-3 @md:items-center hover:bg-muted/20 bg-muted/0 p-2 rounded-lg border-border/0 border hover:border-border duration-300"
                key={i}
              >
                <div className="flex gap-3 grow items-center">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{customer.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex text-sm flex-col grow">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex text-sm @md:items-end justify-center gap-1 items-center @md:flex-col w-fit">
                  <p className=" font-light text-xs hidden @md:flex text-muted-foreground">
                    {t("points")}
                  </p>
                  <Badge
                    className="w-fit flex items-center gap-1 font-light"
                    variant={"outline"}
                  >
                    {customer.totalPoints}{" "}
                    <p className="@md:hidden font-light text-xs text-muted-foreground">
                      {t("points")}
                    </p>
                  </Badge>
                </div>
              </Link>
            ))}
        </div>
        <div className="p-4 gap-3 col-span-1 rounded-lg border-border border flex flex-col h-full">
          <p className="text-lg font-semibold text-primary">
            {t("topAdventuresThisQuarter")}
          </p>
          {isFetching && (
            <>
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </>
          )}
          {!isFetching &&
            statistics?.topAdventuresThisQuarter.map((adventure, i) => (
              <Link
                href={`/${locale}/admin/products/adventures/edit/${adventure.slug}`}
                className="flex gap-3 items-center hover:bg-muted/20 bg-muted/0 p-2 rounded-lg border-border/0 border hover:border-border duration-300"
                key={i}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    className="object-cover"
                    src={adventure.image ?? "/assets/images/adventure.jpg"}
                  />
                  <AvatarFallback>
                    {<ImageOff className="w-4 h-4 text-muted-foreground" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex text-sm flex-col grow">
                  <p className="font-medium">{adventure.title}</p>
                </div>
                <div className="flex text-sm items-end justify-center gap-1 flex-col w-fit">
                  <p className=" font-light text-xs text-muted-foreground">
                    {t("customers")}
                  </p>
                  <Badge className="w-fit font-light" variant={"outline"}>
                    {adventure.totalCustomers}
                  </Badge>
                </div>
              </Link>
            ))}
        </div>
      </div>
      {/* Upcoming adventures */}
      <div className="grid gap4 grid-cols-1 xl:gap-6">
        <div className="p-4 gap-3 col-span-1 @container rounded-lg border-border border flex flex-col h-full">
          <p className="text-lg font-semibold text-primary">
            {t("upComingAdventures")}
          </p>
          {isFetching && (
            <>
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
              <Skeleton className="w-full h-16" />
            </>
          )}
          {!isFetching &&
            statistics?.upcomingAdventures.map((adventure, i) => (
              <Link
                href={`/${locale}/admin/products/adventures/edit/${adventure.slug}`}
                className="flex gap-3 items-center hover:bg-muted/20 bg-muted/0 p-2 rounded-lg border-border/0 border hover:border-border duration-300"
                key={i}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    className="object-cover"
                    src={adventure.image ?? "/assets/images/adventure.jpg"}
                  />
                  <AvatarFallback>
                    {<ImageOff className="w-4 h-4 text-muted-foreground" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex text-sm flex-col grow">
                  <p className="font-medium">{adventure.title}</p>
                </div>
                <div className="flex flex-col @md:gap-3 @md:flex-row items-center">
                  <div className="flex text-sm items-end justify-center gap-1 flex-col w-fit">
                    <Badge className="w-fit font-light" variant={"outline"}>
                      {adventure.startDate}
                    </Badge>
                  </div>
                  <span className="hidden @md:flex text-xs text-muted-foreground font-light">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                  <span className="flex @md:hidden text-xs text-muted-foreground font-light">
                    <ArrowDown className="w-3 h-3" />
                  </span>
                  <div className="flex text-sm items-end justify-center gap-1 flex-col w-fit">
                    <Badge className="w-fit font-light" variant={"outline"}>
                      {adventure.endDate}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

type TStatisticsCard = {
  className?: string;
};

const StatisticsCard: FC<PropsWithChildren<TStatisticsCard>> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "rounded-lg border-border border  flex-col flex p-4 gap-2",
        className
      )}
    >
      {children}
    </div>
  );
};

const StatisticsHeader: FC<PropsWithChildren> = ({ children }) => {
  return <p className="text-sm font-medium text-foreground">{children}</p>;
};
const StatisticsValue: FC<PropsWithChildren> = ({ children }) => {
  return <p className="text-lg text-primary font-semibold">{children}</p>;
};
