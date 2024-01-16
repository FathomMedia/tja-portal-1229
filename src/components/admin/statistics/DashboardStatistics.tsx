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
  BookHeartIcon,
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
          <StatisticsCard className="justify-between">
            <div className="flex items-start gap-3 justify-between">
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

          <StatisticsCard className="justify-between">
            <div className="flex items-start gap-3 justify-between">
              <StatisticsHeader>{t("totalCustomers")}</StatisticsHeader>
              <Users className="w-4 h-4 text-muted-foreground" />
            </div>
            <StatisticsValue>{statistics.totalCustomers}</StatisticsValue>
          </StatisticsCard>

          <StatisticsCard className="@container justify-between">
            <div className="flex items-start gap-3 justify-between">
              <StatisticsHeader>{t("totalAdventureBookings")}</StatisticsHeader>
              <Plane className="w-4 h-4 text-muted-foreground" />
            </div>
            <StatisticsValue>
              {statistics.totalBookings.adventures}
            </StatisticsValue>
          </StatisticsCard>
          <StatisticsCard className="@container justify-between">
            <div className="flex items-start gap-3 justify-between">
              <StatisticsHeader>
                {t("totalConseltationBookings")}
              </StatisticsHeader>
              <BookHeartIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <StatisticsValue>
              {statistics.totalBookings.consultations}
            </StatisticsValue>
          </StatisticsCard>
        </div>
      )}
      {/* grid of chart and recent orders */}
      <div className="grid grid-cols-1 xl:grid-cols-7 gap-4 xl:gap-6">
        {/* chart */}
        <div className=" gap-3 col-span-1 xl:col-span-4 flex flex-col h-full">
          <p className="text-lg  font-semibold text-primary">
            {t("monthlyRevenue")}
          </p>
          <div className="rounded-lg border-border border flex flex-col p-6 bg-white/50">
            <RevenueChart />
            <p className="text-xs text-muted-foreground">
              {t("valuesAreInBHD")}
            </p>
          </div>
        </div>
        {/* recent orders */}
        <div className="col-span-1 xl:col-span-3  flex flex-col h-full gap-3">
          <p className="text-lg font-semibold text-primary">
            {t("latestOrders")}
          </p>
          <div className="rounded-lg grow border-border bg-white/50 border p-6">
            <LatestsOrdersComponent />
          </div>
        </div>
      </div>
      {/* grid of top customers and top adventures upcoming adventures */}
      <div className="grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-4 xl:gap-6 3xl:gap-6">
        <div className="col-span-1 flex flex-col gap-2">
          <p className="text-lg font-semibold text-primary">
            {t("topCustomers")}
          </p>
          <div className="p-6 gap-3 col-span-1 rounded-lg @container bg-white/50 border-border border flex flex-col h-full">
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
                  className="flex w-full gap-3 @md:items-center hover:bg-muted/60 bg-muted/0 p-2 rounded-lg border-border/0 border hover:border-border duration-300"
                  key={i}
                >
                  <div className="flex overflow-clip flex-1 gap-3 grow items-center">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {customer.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex text-sm flex-col grow">
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-muted-foreground text-xs w-full text-ellipsis">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-sm justify-center gap-1 items-center @md:flex-col w-fit">
                    <p className=" font-light text-xs hidden @md:flex text-muted-foreground">
                      {t("points")}
                    </p>
                    <Badge
                      className="w-fit flex bg-background items-center gap-1 font-light"
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
        </div>
        <div className="col-span-1 flex flex-col gap-2">
          <p className="text-lg font-semibold text-primary">
            {t("topAdventuresThisQuarter")}
          </p>
          <div className="p-6 gap-3 col-span-1 rounded-lg border-border bg-white/50 border flex flex-col h-full">
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
                  href={`/${locale}/admin/products/adventures/bookings/${adventure.slug}`}
                  className="flex gap-3 items-center hover:bg-muted/60 bg-muted/0 p-2 rounded-lg border-border/0 border hover:border-border duration-300"
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
                    <Badge
                      className="w-fit font-light bg-background"
                      variant={"outline"}
                    >
                      {adventure.totalCustomers}
                    </Badge>
                  </div>
                </Link>
              ))}
          </div>
        </div>
        {/* Upcoming adventures */}
        <div className="col-span-1 lg:col-span-2 3xl:col-span-1 flex flex-col gap-2">
          <p className="text-lg font-semibold text-primary">
            {t("upComingAdventures")}
          </p>
          <div className="p-6 gap-3  bg-white/50 @container rounded-lg border-border border flex flex-col h-full">
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
                  href={`/${locale}/admin/products/adventures/bookings/${adventure.slug}`}
                  className="flex gap-10 items-center hover:bg-muted/60 bg-muted/0 p-2 rounded-lg border-border/0 border hover:border-border duration-300"
                  key={i}
                >
                  <div className="flex items-center gap-3 grow">
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
                  </div>
                  <div className="flex flex-col @md:gap-3 @md:flex-row items-center">
                    <div className="flex text-sm items-end justify-center gap-1 flex-col w-fit">
                      <Badge
                        className="w-fit font-light bg-background"
                        variant={"outline"}
                      >
                        {adventure.startDate}
                      </Badge>
                    </div>
                    <span className="hidden @md:flex text-xs text-muted-foreground font-light">
                      <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                    </span>
                    <span className="flex @md:hidden text-xs text-muted-foreground font-light">
                      <ArrowDown className="w-3 h-3" />
                    </span>
                    <div className="flex text-sm items-end justify-center gap-1 flex-col w-fit">
                      <Badge
                        className="w-fit font-light bg-background"
                        variant={"outline"}
                      >
                        {adventure.endDate}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
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
        "rounded-lg border-border border bg-white/50 flex-col flex p-6 gap-4",
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
  return (
    <p className="text-xl text-primary font-bold font-helveticaNeue">
      {children}
    </p>
  );
};
