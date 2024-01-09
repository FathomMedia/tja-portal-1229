"use client";
import { TAdventureBookingOrder } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { cn, formatePrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import dayjs from "dayjs";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Adventures");

  const { data: booking, isFetching: isFetchingAdventure } =
    useQuery<TAdventureBookingOrder>({
      queryKey: [`/adventure-bookings/${id}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/adventure-bookings/${id}`, locale }).then(
          (res) => res.json().then((resData) => resData.data)
        ),
    });

  return (
    <div>
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
        <div className="relative flex flex-col md:flex-row md:gap-5 space-y-3 md:space-y-0 rounded-xl p-4  mx-auto border border-white bg-white">
          <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white relative grid place-items-center">
            <Image
              width={200}
              height={200}
              src={booking.adventure.image ?? "/assets/images/adventure.jpg"}
              alt={booking.adventure.title}
              className="rounded-md w-full h-full object-cover"
            />
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
              <h3 className="font-black font-helveticaNeue text-primary md:text-3xl text-xl">
                {booking.adventure.title}
              </h3>
              <div className="text-xs mt-1 text-muted-foreground font-light flex gap-1">
                {t("bookedAt")}{" "}
                <p>{dayjs(booking.dateBooked).format("DD/MM/YYYY")}</p>
              </div>
              <div className=" gap-4 flex flex-col @md:flex-row text-sm text-primary py-6">
                <p>
                  {t("startDate")}: {booking.adventure.startDate}
                </p>
                <p>
                  {t("endDate")}: {booking.adventure.endDate}
                </p>
              </div>
            </div>
            <div className="w-full flex gap-3 flex-col @sm:flex-row  justify-between items-start @sm:items-end">
              {booking.isFullyPaid && (
                <Link
                  href={`/${locale}/dashboard/adventures/bookings/${booking.id}`}
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" })
                  )}
                >
                  {/* {t("downloadReceipt")} <Download className="ms-2 w-4 h-4" /> */}
                  {t("viewMore")}
                </Link>
              )}
              {!booking.isFullyPaid && (
                <Link
                  href={`/${locale}/dashboard/adventures/bookings/${booking.id}`}
                  type="button"
                  className={
                    (cn(buttonVariants({ variant: "ghost", size: "sm" })),
                    "text-secondary underline hover:text-secondary hover:bg-secondary/10")
                  }
                >
                  {t("completePayment")}
                </Link>
              )}

              <div className="flex items-baseline gap-2">
                <p className="text-sm text-muted-foreground">{t("total")}</p>
                <p className="text-xl font-black text-primary ">
                  {formatePrice({ locale, price: booking.adventure.price })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
