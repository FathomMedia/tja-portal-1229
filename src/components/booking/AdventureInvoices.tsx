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
import { TAdventureBookingOrder, TInvoice } from "@/lib/types";
import Link from "next/link";

type TAdventureInvoices = {
  invoices?: (TInvoice | null)[];
  //   partialInvoice?: TInvoice | null;
  //   remainingInvoice?: TInvoice | null;
  //   fullInvoice?: TInvoice | null;
};

export const AdventureInvoices: FC<TAdventureInvoices> = ({
  invoices,
  //   partialInvoice,
  //   remainingInvoice,
  //   fullInvoice,
}) => {
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
          {invoices?.map(
            (invoice, i) =>
              invoice && (
                <TableRow key={i} className={cn()}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell className="font-medium">
                    {formatePrice({
                      locale,
                      price: invoice.totalAmount,
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{invoice.vat}</TableCell>
                  <TableCell className="font-medium">
                    {invoice.isPaid ? (
                      <CheckCircle2 className="text-primary" />
                    ) : (
                      <LucideMinusCircle className="text-destructive" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {dayjs(invoice.receipt?.created_at).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell className="text-start">
                    {invoice.path ? (
                      <Link
                        className={cn(buttonVariants({ variant: "ghost" }))}
                        href={invoice.path}
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
                    {invoice.receipt?.path ? (
                      <Link
                        className={cn(buttonVariants({ variant: "ghost" }))}
                        href={invoice.receipt?.path}
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
              )
          )}
          {/* {partialInvoice && (
            <TableRow className={cn()}>
              <TableCell className="font-medium">{partialInvoice.id}</TableCell>
              <TableCell className="font-medium">
                {formatePrice({
                  locale,
                  price: partialInvoice.totalAmount,
                })}
              </TableCell>
              <TableCell className="font-medium">
                {partialInvoice.vat}
              </TableCell>
              <TableCell className="font-medium">
                {partialInvoice.isPaid ? (
                  <CheckCircle2 className="text-primary" />
                ) : (
                  <LucideMinusCircle className="text-destructive" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {dayjs(partialInvoice.receipt?.created_at).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="text-start">
                {partialInvoice.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={partialInvoice.path}
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
                {partialInvoice.receipt?.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={partialInvoice.receipt?.path}
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
          {remainingInvoice && (
            <TableRow className={cn()}>
              <TableCell className="font-medium">
                {remainingInvoice.id}
              </TableCell>
              <TableCell className="font-medium">
                {formatePrice({
                  locale,
                  price: remainingInvoice.totalAmount,
                })}
              </TableCell>
              <TableCell className="font-medium">
                {remainingInvoice.vat}
              </TableCell>
              <TableCell className="font-medium">
                {remainingInvoice.isPaid ? (
                  <CheckCircle2 className="text-primary" />
                ) : (
                  <LucideMinusCircle className="text-destructive" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {dayjs(remainingInvoice.receipt?.created_at).format(
                  "DD/MM/YYYY"
                )}
              </TableCell>
              <TableCell className="text-start">
                {remainingInvoice.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={remainingInvoice.path}
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
                {remainingInvoice.receipt?.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={remainingInvoice.receipt?.path}
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
          {fullInvoice && (
            <TableRow className={cn()}>
              <TableCell className="font-medium">{fullInvoice.id}</TableCell>
              <TableCell className="font-medium">
                {formatePrice({
                  locale,
                  price: fullInvoice.totalAmount,
                })}
              </TableCell>
              <TableCell className="font-medium">{fullInvoice.vat}</TableCell>
              <TableCell className="font-medium">
                {fullInvoice.isPaid ? (
                  <CheckCircle2 className="text-primary" />
                ) : (
                  <LucideMinusCircle className="text-destructive" />
                )}
              </TableCell>
              <TableCell className="font-medium">
                {dayjs(fullInvoice.receipt?.created_at).format("DD/MM/YYYY")}
              </TableCell>
              <TableCell className="text-start">
                {fullInvoice.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={fullInvoice.path}
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
                {fullInvoice.receipt?.path ? (
                  <Link
                    className={cn(buttonVariants({ variant: "ghost" }))}
                    href={fullInvoice.receipt?.path}
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
          )} */}
          {!invoices ||
            (invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-start">
                  {t("nothingFound")}
                </TableCell>
              </TableRow>
            ))}
          {/* {!partialInvoice && !remainingInvoice && !fullInvoice && (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-start">
                {t("nothingFound")}
              </TableCell>
            </TableRow>
          )} */}
        </TableBody>
      </Table>
    </div>
  );
};
