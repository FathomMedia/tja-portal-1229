"use client";
import { LucideProps } from "lucide-react";
import React, { FC } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button, buttonVariants } from "../ui/button";
import { TAdventureBookingOrder } from "@/lib/types";
import { format } from "date-fns";
import { cn, formatePrice, parseDateFromAPI } from "@/lib/utils";
import dayjs from "dayjs";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ar, enUS } from "date-fns/locale";
import { Icons } from "../ui/icons";

type TReservedBookingCard = {
  booking: TAdventureBookingOrder;
};

export const ReservedBookingCard: FC<TReservedBookingCard> = ({ booking }) => {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  return (
    <Card key="1" className="w-full max-w-lg">
      <CardHeader className="flex flex-col items-start space-y-2 border-b">
        <CardTitle>{t("reservationConfirmed")}</CardTitle>
        <CardDescription>{t("completeBankTransfer")}</CardDescription>
      </CardHeader>
      <CardContent className="gap-3 flex flex-col pt-6">
        <div className="flex items-start gap-3">
          <PackageIcon className="w-6 h-6 mt-1" />
          <div>
            <div className="font-semibold">{t("adventureName")}</div>
            <div>{booking.adventure.title}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarCheckIcon className="w-6 h-6 mt-1" />
          <div>
            <div className="font-semibold">{t("dateBooked")}</div>
            <div>
              {format(
                parseDateFromAPI(booking.dateBooked.toString()),
                "MMM d, yyyy",
                { locale: locale === "ar" ? ar : enUS }
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <CalendarMinusIcon className="w-6 h-6 mt-1" />
          <div>
            <div className="font-semibold">{t("dueDateForBankTransfer")}</div>
            <div>
              {format(
                dayjs(parseDateFromAPI(booking.dateBooked.toString()))
                  .add(2, "days")
                  .toDate(),
                "MMM d, yyyy",
                { locale: locale === "ar" ? ar : enUS }
              )}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {/* <CurrencyIcon className="w-6 h-6 mt-1" /> */}
          <Icons.banktransfer className="w-6 h-6 mt-1" />
          {booking.partialInvoice && (
            <div>
              <div className="font-semibold">{t("price")}</div>
              {/* <div>
              {
                formatePrice({
                  locale,
                  price: booking.partialInvoice.totalAmount,
                })}
              {booking.fullInvoice &&
                formatePrice({
                  locale,
                  price: booking.fullInvoice.totalAmount,
                })}
            </div> */}
              <p className="flex items-baseline gap-1 flex-wrap text-sm">
                {t("partialPrice")}
                <span className="font-medium">
                  {formatePrice({
                    locale,
                    price: booking.partialInvoice.totalAmount,
                  })}
                </span>
              </p>
              <p className="flex items-baseline gap-1 flex-wrap text-sm">
                {t("totalAmountDue")}
                <span className="font-medium">
                  {formatePrice({
                    locale,
                    price: booking.netAmount,
                  })}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3">
          <CheckIcon className="w-6 h-6 mt-1" />
          <div>
            <div className="font-semibold">{t("status")}</div>
            <div>{booking.status}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-3 border-t pt-6">
        <Link
          href={"https://thejourneyadventures.com/get-in-touch"}
          className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
        >
          {t("contactUs")}
        </Link>
        <Link
          href={`/${locale}/dashboard/adventures/bookings/${booking.id}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          {t("goToBooking")}
        </Link>
      </CardFooter>
    </Card>
  );
};

function CalendarCheckIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

function CalendarMinusIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <line x1="16" x2="22" y1="19" y2="19" />
    </svg>
  );
}

function CheckIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CurrencyIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="3" x2="6" y1="3" y2="6" />
      <line x1="21" x2="18" y1="3" y2="6" />
      <line x1="3" x2="6" y1="21" y2="18" />
      <line x1="21" x2="18" y1="21" y2="18" />
    </svg>
  );
}

function PackageIcon(props: LucideProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
