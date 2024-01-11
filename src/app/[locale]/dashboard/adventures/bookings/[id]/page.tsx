"use client";
import { TAdventureBookingOrder } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  MessageCircle,
  MessageSquareDashed,
  CheckCircle2,
  DollarSign,
  Globe,
  Plane,
  Download,
} from "lucide-react";
import { cn, formatePrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import { useSearchParams } from "next/navigation";
import { AdventureInvoices } from "@/components/booking/AdventureInvoices";
import { PayRemaining } from "@/components/booking/PayRemainingAdventure";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  const searchParams = useSearchParams();

  const isRedirect = Boolean(searchParams.get("redirected"));

  const { data: booking, isFetching: isFetchingAdventure } =
    useQuery<TAdventureBookingOrder>({
      queryKey: [`/adventure-bookings/${id}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/adventure-bookings/${id}`, locale }).then(
          (res) => res.json().then((resData) => resData.data)
        ),
    });

  return (
    <div className="flex flex-col w-full @container">
      {isFetchingAdventure && (
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-72" />
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
          <Skeleton className="w-full h-28" />
        </div>
      )}
      {!booking && !isFetchingAdventure && (
        <div className="p-4 bg-muted text-muted-foreground text-sm rounded-md h-72 flex flex-col justify-center items-center">
          <p>{t("nothingFound")}</p>
        </div>
      )}
      {booking && !isFetchingAdventure && (
        <div className="flex flex-col w-full gap-3">
          {/* Alerts */}
          <div className="flex flex-col w-full gap-4">
            {isRedirect && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 " />
                <AlertTitle>{t("bookingConfirmed")}</AlertTitle>
                <AlertDescription className="text-xs">
                  {t("yourBookingIsConfirmd")}
                </AlertDescription>
              </Alert>
            )}
            {!booking.isFullyPaid && (
              <Alert className="text-primary-foreground border-primary-foreground bg-primary">
                <DollarSign className="h-4 w-4 !text-primary-foreground" />
                <AlertTitle>Pending payment!</AlertTitle>
                <AlertDescription className="text-xs">
                  {`Complete your payment for ${booking.adventure.title} before ${booking.adventure.startDate} to secure spot.`}{" "}
                  <span>
                    {
                      <PayRemaining
                        text={t("clickHereToCompletePayment")}
                        booking={booking}
                        className="text-current text-xs font-normal hover:text-current hover:bg-white/10"
                      />
                    }
                  </span>
                </AlertDescription>
              </Alert>
            )}
          </div>
          <div className="relative flex flex-col md:flex-row md:gap-5 space-y-3 md:space-y-0 rounded-xl p-4 border border-white bg-white">
            <div className="w-full md:w-1/3 aspect-video rounded-md overflow-clip md:aspect-square bg-white relative grid place-items-center">
              <Image
                width={200}
                height={200}
                src={booking.adventure.image ?? "/assets/images/adventure.jpg"}
                alt={booking.adventure.title}
                className=" w-full h-full  object-cover"
              />

              <div className="text-sm flex items-center z-20 top-4 left-4 absolute gap-3 uppercase ">
                <Avatar className="w-12 border h-12 min-w-fit">
                  {booking.adventure.continentImage && (
                    <AvatarImage
                      className="object-cover"
                      src={booking.adventure.continentImage}
                    />
                  )}
                  <AvatarFallback className=" text-muted rounded-full bg-transparent border">
                    {booking.adventure.continent.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="w-full @container md:w-2/3 bg-white flex flex-col justify-between space-y-2 p-3">
              <div className="flex flex-col gap-2 ">
                <div className="flex justify-between item-center">
                  <p className="text-gray-500 font-light hidden md:block">
                    {t("adventure")}
                  </p>
                  {booking.isFullyPaid ? (
                    <Badge className="bg-teal-400/40 text-ebg-teal-400 hover:bg-teal-400/30 hover:text-ebg-teal-400 font-light">
                      {t("paid")}
                      <CheckCircle className="ms-1 w-[0.65rem] h-[0.65rem]" />
                    </Badge>
                  ) : (
                    <Badge className="bg-secondary/40 text-secondary hover:bg-secondary/30 hover:text-secondary font-light">
                      {t("pendingPayment")}
                    </Badge>
                  )}
                </div>
                <Link
                  href={booking.adventure.link ?? "#"}
                  className="font-black flex items-center gap-1 font-helveticaNeue w-fit hover:underline text-primary md:text-3xl text-xl"
                >
                  {booking.adventure.title}{" "}
                  <span>
                    <Globe className="mb-1" />
                  </span>
                </Link>
                <div className="text-xs mt-1 text-muted-foreground font-light flex gap-1">
                  {t("bookedAt")}
                  <p>{dayjs(booking.dateBooked).format("DD/MM/YYYY")}</p>
                </div>
                <div className=" gap-4 flex flex-col @md:flex-row text-sm text-primary py-6">
                  <p>
                    {t("startDate")} {booking.adventure.startDate}
                  </p>
                  <p>
                    {t("endDate")} {booking.adventure.endDate}
                  </p>
                </div>
              </div>
              <div className="w-full flex gap-3 flex-col @sm:flex-row  justify-between items-start @sm:items-end">
                {booking.isFullyPaid && (
                  <Link
                    href={booking.adventure.link}
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" })
                    )}
                  >
                    {t("viewMore")}
                  </Link>
                )}
                {!booking.isFullyPaid && <PayRemaining booking={booking} />}

                <div className="flex items-baseline gap-2">
                  <p className="text-sm text-muted-foreground">{t("total")}</p>
                  <p className="text-xl font-black text-primary ">
                    {formatePrice({ locale, price: booking.adventure.price })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Toolkit */}

          <div className="flex flex-col @xl:flex-row items-center gap-3">
            <div className="flex flex-col gap-2">
              <h3 className=" text-primary font-semibold text-xl flex items-center gap-1">
                <span>
                  <Plane className="w-4 h-4 fill-primary" />
                </span>{" "}
                {t("tripToolkit")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("importantResourcesForASeamlessAndUnforgettableJourney")}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {booking.adventure.travelGuide && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-primary border-primary hover:text-primary"
                  )}
                  href={booking.adventure.travelGuide}
                >
                  {t("travelGuide")}{" "}
                  <span>
                    <Download className="w-4 h-4 text-center" />
                  </span>
                </Link>
              )}
              {booking.adventure.fitnessGuide && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-primary border-primary hover:text-primary"
                  )}
                  href={booking.adventure.fitnessGuide}
                >
                  {t("fitnessGuide")}{" "}
                  <span>
                    <Download className="w-4 h-4 text-center" />
                  </span>
                </Link>
              )}
              {booking.adventure.packingList && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "text-primary border-primary hover:text-primary"
                  )}
                  href={booking.adventure.packingList}
                >
                  {t("packingList")}{" "}
                  <span>
                    <Download className="w-4 h-4 text-center" />
                  </span>
                </Link>
              )}
            </div>
          </div>
          {/* flight details */}
          <div></div>

          {/* Invoices */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
              {t("invoices")}
            </h2>
            <AdventureInvoices
              invoices={[
                {
                  type: "partial",
                  invoice: booking.partialInvoice,
                },
                {
                  type: "remaining",
                  invoice: booking.remainingInvoice,
                },
                {
                  type: "full",
                  invoice: booking.fullInvoice,
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
