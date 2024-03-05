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
import { useLocale } from "next-intl";
import Link from "next/link";

type TReservedBookingCard = {
  booking: TAdventureBookingOrder;
};

export const ReservedBookingCard: FC<TReservedBookingCard> = ({ booking }) => {
  const locale = useLocale();
  console.log("🚀 ~ booking:", booking);
  return (
    <Card key="1" className="w-full max-w-lg mx-auto">
      <CardHeader className="flex flex-col items-center space-y-2">
        <CardTitle>Reservation confirmed</CardTitle>
        <CardDescription>
          Please complete the bank transfer within 48 hours using the
          information sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-3 flex flex-col">
        <div className="flex items-center gap-2">
          <PackageIcon className="w-6 h-6" />
          <div>
            <div className="font-semibold">Adventure Name</div>
            <div>{booking.adventure.title}</div>
            {/* <div>Cozy and Charming Mountain Retreat with Hot Tub</div> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarCheckIcon className="w-6 h-6" />
          <div>
            <div className="font-semibold">Date Booked</div>
            <div>
              {format(
                parseDateFromAPI(booking.dateBooked.toString()),
                "MMM d, yyyy"
              )}
            </div>
            {/* <div>June 1, 2024</div> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarMinusIcon className="w-6 h-6" />
          <div>
            <div className="font-semibold">Due Date for Bank Transfer</div>
            <div>
              {format(
                dayjs(parseDateFromAPI(booking.dateBooked.toString()))
                  .add(2, "days")
                  .toDate(),
                "MMM d, yyyy"
              )}
            </div>
            {/* <div>June 5, 2024</div> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CurrencyIcon className="w-6 h-6" />
          <div>
            <div className="font-semibold">Price</div>
            <div>
              {booking.partialInvoice &&
                formatePrice({
                  locale,
                  price: booking.partialInvoice.totalAmount,
                })}
              {booking.fullInvoice &&
                formatePrice({
                  locale,
                  price: booking.fullInvoice.totalAmount,
                })}
            </div>
            {/* <div>$XXX</div> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckIcon className="w-6 h-6" />
          <div>
            <div className="font-semibold">Status</div>
            <div>{booking.status}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Link
          href={"https://thejourneyadventures.com/get-in-touch"}
          className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
        >
          Contact Us
        </Link>
        <Link
          href={`/${locale}/dashboard/adventures/bookings/${booking.id}`}
          className={cn(buttonVariants({ variant: "default" }), "w-full")}
        >
          Go to booking
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
