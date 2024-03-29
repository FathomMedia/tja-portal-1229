"use client";

import { TAdventure, TConsultation, TOrder, TOrders, TUser } from "@/lib/types";
import React from "react";
import { DashboardSection } from "../DashboardSection";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { LoadingComp } from "../LoadingComp";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { CheckCircle, Globe, Timer } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { cn, formatePrice } from "@/lib/utils";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const DashboardHome = () => {
  const locale = useLocale();

  const { data: user, isFetching: isFetchingUser } = useQuery<TUser>({
    queryKey: ["/users/profile"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/users/profile", locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
  });

  const { data: latestOrders, isFetching: isFetchingLatestOrders } =
    useQuery<TOrders>({
      queryKey: ["/profile/bookings"],
      queryFn: () =>
        apiReqQuery({ endpoint: "/profile/bookings", locale }).then((res) =>
          res.json()
        ),
    });

  const upComingAdventures = latestOrders?.data
    ? latestOrders?.data.filter(
        (order: any) => order.type === "adventure" && order.details.isUpcoming
      )
    : [];

  const t = useTranslations("Home");
  return (
    <DashboardSection hideBack title={t("myAccount")}>
      <div className=" flex flex-col gap-4">
        <div className="flex gap-3">
          {isFetchingUser && <Skeleton className="h-20 w-full max-w-xs" />}
          {!isFetchingUser && (
            <div className="bg-[#2F9D83] rounded-xl flex sm:w-fit w-full flex-col">
              <div className="flex items-center ">
                {/* Current Tier */}
                <div className=" flex-1 flex text-center flex-col px-4 sm:px-8 gap-1 py-3 sm:py-6">
                  <p className="text-sm text-white/60">{t("currentTier")}</p>
                  <h2 className="text-2xl text-white  font-helveticaNeue font-black ">
                    {user?.level?.name}
                  </h2>
                </div>
                {/* divider */}
                <div className="w-[1px] h-full bg-white/60"></div>
                {/* Days Travelled */}
                <div className=" flex-1 flex p-4 flex-col px-4 min-w-fit sm:px-8 text-center gap-1 py-3 sm:py-6">
                  <p className="text-sm text-white/60 min-w-fit">
                    {t("daysTravelled")}
                  </p>
                  <h2 className="text-2xl text-white  font-helveticaNeue font-black ">{`${
                    user?.daysTravelled + " " + t("days")
                  } `}</h2>
                </div>
                <div className="w-[1px] hidden sm:block h-full bg-white/60"></div>
                <div className="hidden sm:flex p-4 flex-col px-4 sm:px-8 text-center gap-1 py-3 sm:py-6">
                  <p className="text-sm text-white/60">
                    {t("availablePoints")}
                  </p>
                  <h2 className="text-2xl text-white  font-helveticaNeue font-black ">{`${user?.points} `}</h2>
                </div>
              </div>
              <div className=" sm:hidden block h-[1px] w-full bg-white/60"></div>
              <div className="sm:hidden flex p-4 flex-col items-center px-4 sm:px-8 text-center gap-1 py-3 sm:py-6">
                <p className="text-sm text-white/60">{t("availablePoints")}</p>
                <h2 className="text-2xl text-white  font-helveticaNeue font-black ">{`${user?.points} `}</h2>
              </div>
            </div>
          )}
        </div>
        {isFetchingLatestOrders && (
          <div>
            <LoadingComp />
          </div>
        )}
        {!isFetchingLatestOrders && (
          <div className=" py-6 flex flex-col gap-10">
            {/* Up coming adventures */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-primary">
                {t("upComingAdventures")}
              </h1>
              <div className="grid grid-cols-1 gap-3">
                {upComingAdventures.map((order, i) => {
                  return (
                    <div className="min-h-[10rem] " key={i}>
                      {order.type === "adventure" && (
                        <Adventure order={order} />
                      )}
                    </div>
                  );
                })}
                {upComingAdventures.length == 0 && (
                  <div className="bg-muted rounded-lg gap-4 px-6 py-4 flex flex-wrap items-center text-muted-foreground">
                    <p>{t("noUpcoming")}</p>
                    <Link
                      href={`/${locale}/dashboard/adventures`}
                      className={cn(
                        buttonVariants({ variant: "secondary" }),
                        "w-fit"
                      )}
                    >
                      {t("bookYourAdventure")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* Latest orders */}

            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-primary">{t("latestsOrders")}</h1>
              <div className="grid grid-cols-1 gap-3">
                {latestOrders?.data?.map((order, i) => {
                  return (
                    <div className="min-h-[10rem] h-fit" key={i}>
                      {order.type === "adventure" && (
                        <Adventure order={order} />
                      )}
                      {order.type === "consultation" && (
                        <Consultation order={order} />
                      )}
                    </div>
                  );
                })}
                {(!latestOrders?.data || latestOrders?.data?.length == 0) && (
                  <div className="bg-muted rounded-lg p-3 text-muted-foreground">
                    <p>{t("noOrdersFound")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div></div>
    </DashboardSection>
  );
};

const Consultation = ({ order }: { order: TOrder }) => {
  const t = useTranslations("Home");
  const locale = useLocale();

  const consultation = order.details as TConsultation;
  return (
    <Link
      href={`/${locale}/dashboard/consultations/bookings/${order.id}`}
      className="relative hover:shadow-xl h-fit flex flex-col  duration-200 group md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3  mx-auto border border-white bg-white"
    >
      <div className="w-full md:w-1/3 aspect-video overflow-clip rounded-md md:aspect-square bg-white relative grid place-items-center">
        <Image
          width={200}
          height={100}
          src="/assets/images/consultation.jpg"
          alt="tailwind logo"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-2/3 bg-white flex flex-col justify-between space-y-2 p-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between item-center">
            <p className="font-light text-gray-500 hidden md:block">
              {t("consultation")}
            </p>
            <div className="flex flex-wrap md:flex-row gap-2">
              {!order.isCancelled ? (
                <div></div>
              ) : (
                <Badge className="bg-destructive/40 text-destructive hover:bg-destructive/30 hover:text-destructive font-light uppercase">
                  {t("cancelled")}
                </Badge>
              )}

              {order.isPaid ? (
                <Badge className="bg-teal-400/40 text-ebg-teal-400 hover:bg-teal-400/30 hover:text-ebg-teal-400 font-light">
                  {t("paid")}
                  <CheckCircle className="ms-1 w-[0.65rem] h-[0.65rem]" />
                </Badge>
              ) : (
                <Badge className="bg-secondary/40 text-secondary hover:bg-secondary/30 hover:text-secondary font-light">
                  {t("error")}
                </Badge>
              )}
            </div>
          </div>
          <p className="font-black flex group-hover:underline items-center gap-1 font-helveticaNeue text-primary md:text-3xl text-xl">
            {consultation.tier}{" "}
            <span>
              <Globe className="mb-2" />
            </span>
          </p>
          <div className="text-xs mt-1 text-muted-foreground font-light flex gap-1">
            {t("bookedAt")}:<p>{order.dateBooked}</p>
          </div>
          <div className=" text-sm text-primary gap-1 flex py-6">
            {t("days")}:<p>{consultation.numberOfDays}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 justify-end">
          <p className="text-sm text-muted-foreground">{t("netTotal")}</p>
          <p className="text-xl font-black text-primary ">
            {formatePrice({ locale, price: order.netAmount })}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Adventure = ({ order }: { order: TOrder }) => {
  const adventure = order.details as TAdventure;
  const t = useTranslations("Home");
  const locale = useLocale();

  var variant:
    | "info"
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | null
    | undefined;

  switch (order?.statusEnum) {
    case "reserved":
      variant = "info";
      break;
    case "partiallyPaid":
      variant = "secondary";
      break;
    case "fullyPaid":
      variant = "default";
      break;
    case "cancelled":
      variant = "destructive";
      break;
    case "notPaid":
      variant = "outline";
      break;
    default:
      variant = "outline";
      break;
  }
  return (
    <Link
      href={`/${locale}/dashboard/adventures/bookings/${order.id}`}
      className="relative h-fit flex flex-col md:flex-row md:gap-5 space-y-3 md:space-y-0 rounded-xl p-4  mx-auto duration-200 border hover:shadow-xl border-white bg-white"
    >
      <div className="w-full md:w-1/3 aspect-video overflow-clip rounded-md md:aspect-square bg-white relative grid place-items-center">
        <Image
          width={200}
          height={200}
          src={adventure.image ?? "/assets/images/adventure.jpg"}
          alt={adventure.title}
          className=" w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-transparent"></div>
        <div className="text-sm flex items-center gap-3 uppercase absolute top-5 start-5 text-muted">
          <Avatar className="w-12  h-12">
            {adventure.continentImage && (
              <AvatarImage
                className="object-cover"
                src={adventure.continentImage}
              />
            )}
            <AvatarFallback className=" text-muted rounded-full bg-transparent border">
              {adventure.continent.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <p>{adventure.continent}</p>
        </div>
      </div>
      <div className="w-full @container md:w-2/3 bg-white group  flex flex-col justify-between space-y-2 p-3">
        <div className="flex flex-col gap-2 ">
          <div className="flex justify-between item-center">
            <p className="text-gray-500 font-light hidden md:block">
              {t("adventure")}
            </p>
            <div className=" flex gap-2">
              {/* TODO: status */}
              <Badge variant={variant}>{order.status ?? "Unknown"}</Badge>
              {/* {!order.isCancelled ? (
                <div></div>
              ) : (
                <Badge className="bg-destructive/40 text-destructive hover:bg-destructive/30 hover:text-destructive font-light uppercase">
                  {t("cancelled")}
                </Badge>
              )}
              {order.isFullyPaid ? (
                <Badge className="bg-teal-400/40 text-ebg-teal-400 hover:bg-teal-400/30 hover:text-ebg-teal-400 font-light">
                  {t("paid")}
                  <CheckCircle className="ms-1 w-[0.65rem] h-[0.65rem]" />
                </Badge>
              ) : (
                <Badge className="bg-secondary/40 text-secondary hover:bg-secondary/30 hover:text-secondary font-light">
                  {t("pendingPayment")}
                </Badge>
              )} */}
            </div>
          </div>
          <p className="font-black flex group-hover:underline items-center gap-1 font-helveticaNeue text-primary md:text-3xl text-xl">
            {adventure.title}{" "}
            <span>
              <Globe className="mb-2" />
            </span>
          </p>
          <div className="text-xs mt-1 text-muted-foreground font-light flex gap-1">
            {t("bookedAt")} <p>{order.dateBooked}</p>
          </div>
          <div className=" gap-4 flex flex-col @md:flex-row text-sm text-primary py-6">
            <p>
              {t("startDate")}: {adventure.startDate}
            </p>
            <p>
              {t("endDate")}: {adventure.endDate}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary bg-lightPrimary/10 p-2 rounded-sm w-fit flex-wrap">
            <Timer size={18} />
            <p>
              {t("startsIn")}: {adventure.startsIn}
            </p>
          </div>
        </div>
        <div className="w-full flex gap-3 flex-col @sm:flex-row  justify-between items-start @sm:items-end">
          {order.isFullyPaid && (
            <p
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "flex items-center gap-1"
              )}
            >
              {t("viewBooking")}
              <span>
                <Globe className="w-4 h-5" />
              </span>
            </p>
          )}
          {!order.isFullyPaid && order.isPartiallyPaid && !order.isReserved && (
            <p
              className={
                (cn(buttonVariants({ variant: "ghost", size: "sm" })),
                "text-secondary underline hover:text-secondary hover:bg-secondary/10")
              }
            >
              {t("completePayment")}
            </p>
          )}
          {order.isReserved && (
            <p
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "flex items-center gap-1"
              )}
            >
              {t("viewBooking")}
              <span>
                <Globe className="w-4 h-5" />
              </span>
            </p>
          )}

          <div className="flex items-baseline gap-2">
            <p className="text-sm text-muted-foreground">{t("netTotal")}</p>
            <p className="text-xl font-black text-primary ">
              {formatePrice({ locale, price: order.netAmount })}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};
