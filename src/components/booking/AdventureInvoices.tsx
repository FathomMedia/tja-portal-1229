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
import dayjs from "dayjs";
import { CheckCircle2, LucideMinusCircle, Download } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { useLocale, useTranslations } from "next-intl";
import { TInvoice } from "@/lib/types";
import Link from "next/link";
import { Badge } from "../ui/badge";

type TAdventureInvoices = {
  invoices?: {
    type: "partial" | "remaining" | "full";
    invoice: TInvoice | null;
  }[];
};

export const AdventureInvoices: FC<TAdventureInvoices> = ({ invoices }) => {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  return (
    <div className="rounded-md overflow-clip border">
      <Table className="">
        <TableHeader className="">
          <TableRow className="">
            <TableHead className=" text-start ">{t("id")}</TableHead>
            <TableHead className=" text-start ">{t("type")}</TableHead>
            <TableHead className=" text-start ">{t("amount")}</TableHead>
            <TableHead className=" text-start ">{t("vat")}</TableHead>
            <TableHead className=" text-start ">{t("coupon")}</TableHead>
            <TableHead className=" text-start ">{t("isPaid")}</TableHead>
            <TableHead className=" text-start ">{t("date")}</TableHead>
            <TableHead className=" text-start ">{t("invoice")}</TableHead>
            <TableHead className=" text-start ">{t("receipt")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {invoices?.map(
            (item, i) =>
              item.invoice && (
                <TableRow key={i} className={cn()}>
                  <TableCell className="font-medium">
                    {item.invoice.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {
                      <Badge
                        className="uppercase"
                        size={"sm"}
                        variant={"outline"}
                      >
                        {item.type}
                      </Badge>
                    }
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatePrice({
                      locale,
                      price: item.invoice.totalAmount,
                    })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.invoice.vat}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.invoice.coupon ?? "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.invoice.isPaid ? (
                      <CheckCircle2 className="text-primary" />
                    ) : (
                      <LucideMinusCircle className="text-destructive" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {dayjs(item.invoice.receipt?.created_at).format(
                      "DD/MM/YYYY"
                    )}
                  </TableCell>
                  <TableCell className="text-start">
                    {item.invoice.path ? (
                      <Link
                        className={cn(buttonVariants({ variant: "ghost" }))}
                        href={item.invoice.path}
                        target="_blank"
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
                    {item.invoice.receipt?.path ? (
                      <Link
                        className={cn(buttonVariants({ variant: "ghost" }))}
                        href={item.invoice.receipt?.path}
                        target="_blank"
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

          {!invoices ||
            (invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-start">
                  {t("nothingFound")}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
