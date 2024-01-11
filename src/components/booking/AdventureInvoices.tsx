"use client";
import React, { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn, formatePrice } from "@/lib/utils";
import dayjs, { locale } from "dayjs";
import { CheckCircle2, LucideMinusCircle, Download } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import { TAdventureBookingOrder } from "@/lib/types";
import Link from "next/link";

type TAdventureInvoices = {
  booking: TAdventureBookingOrder;
};

export const AdventureInvoices: FC<TAdventureInvoices> = ({ booking }) => {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  return (
    <div className="rounded-md overflow-clip border">
      <Table className="">
        <TableHeader className="">
          <TableRow className="">
            <TableHead className=" text-start ">{t("id")}</TableHead>
            <TableHead className=" text-start ">{t("amount")}</TableHead>
            <TableHead className=" text-start ">{t("vat")}</TableHead>
            <TableHead className=" text-start ">{t("isPaid")}</TableHead>
            <TableHead className=" text-start ">{t("date")}</TableHead>
            <TableHead className=" text-start ">{t("invoice")}</TableHead>
            <TableHead className=" text-start ">{t("receipt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {booking.partialInvoice && (
            <TableRow className={cn()}>
              <TableCell className="font-medium">
                {booking.partialInvoice.id}
              </TableCell>
              <TableCell className="font-medium">
                {formatePrice({
                  locale,
                  price: booking.partialInvoice.totalAmount,
                })}
              </TableCell>
              <TableCell className="font-medium">
                {booking.partialInvoice.vat}
              </TableCell>
              <TableCell className="font-medium">
                {booking.partialInvoice.isPaid ? (
                  <CheckCircle2 className="text-primary" />
                ) : (
                  <LucideMinusCircle className="text-destructive" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {dayjs(booking.partialInvoice.receipt?.created_at).format(
                  "DD/MM/YYYY"
                )}
              </TableCell>
              <TableCell className="text-start">
                {booking.partialInvoice.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={booking.partialInvoice.path}
                  >
                    {t("download")}{" "}
                    <span>
                      <Download className="w-4 h-4 ms-2" />
                    </span>
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-start">
                {booking.partialInvoice.receipt?.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={booking.partialInvoice.receipt?.path}
                  >
                    {t("download")}{" "}
                    <span>
                      <Download className="w-4 h-4 ms-2" />
                    </span>
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          )}
          {booking.remainingInvoice && (
            <TableRow className={cn()}>
              <TableCell className="font-medium">
                {booking.remainingInvoice.id}
              </TableCell>
              <TableCell className="font-medium">
                {formatePrice({
                  locale,
                  price: booking.remainingInvoice.totalAmount,
                })}
              </TableCell>
              <TableCell className="font-medium">
                {booking.remainingInvoice.vat}
              </TableCell>
              <TableCell className="font-medium">
                {booking.remainingInvoice.isPaid ? (
                  <CheckCircle2 className="text-primary" />
                ) : (
                  <LucideMinusCircle className="text-destructive" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {dayjs(booking.remainingInvoice.receipt?.created_at).format(
                  "DD/MM/YYYY"
                )}
              </TableCell>
              <TableCell className="text-start">
                {booking.remainingInvoice.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={booking.remainingInvoice.path}
                  >
                    {t("download")}{" "}
                    <span>
                      <Download className="w-4 h-4 ms-2" />
                    </span>
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-start">
                {booking.remainingInvoice.receipt?.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={booking.remainingInvoice.receipt?.path}
                  >
                    {t("download")}{" "}
                    <span>
                      <Download className="w-4 h-4 ms-2" />
                    </span>
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          )}
          {booking.fullInvoice && (
            <TableRow className={cn()}>
              <TableCell className="font-medium">
                {booking.fullInvoice.id}
              </TableCell>
              <TableCell className="font-medium">
                {formatePrice({
                  locale,
                  price: booking.fullInvoice.totalAmount,
                })}
              </TableCell>
              <TableCell className="font-medium">
                {booking.fullInvoice.vat}
              </TableCell>
              <TableCell className="font-medium">
                {booking.fullInvoice.isPaid ? (
                  <CheckCircle2 className="text-primary" />
                ) : (
                  <LucideMinusCircle className="text-destructive" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {dayjs(booking.fullInvoice.receipt?.created_at).format(
                  "DD/MM/YYYY"
                )}
              </TableCell>
              <TableCell className="text-start">
                {booking.fullInvoice.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={booking.fullInvoice.path}
                  >
                    {t("download")}
                    <span>
                      <Download className="w-4 h-4 ms-2" />
                    </span>
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-start">
                {booking.fullInvoice.receipt?.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={booking.fullInvoice.receipt?.path}
                  >
                    {t("download")}
                    <span>
                      <Download className="w-4 h-4 ms-2" />
                    </span>
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          )}
          {!booking.partialInvoice &&
            !booking.remainingInvoice &&
            !booking.fullInvoice && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-start">
                  {t("nothingFound")}
                </TableCell>
              </TableRow>
            )}
        </TableBody>
      </Table>
    </div>
  );
};
