"use client";

import React, { FC } from "react";

import { useLocale, useTranslations } from "next-intl";
import { TConsultationBooking } from "@/lib/types";

import { Label } from "@/components/ui/label";
import {
  budgetIncludes,
  adventureToYouIs,
  activitiesOptions,
} from "@/components/consultations/consultation-constants";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatePrice } from "@/lib/utils";
import dayjs from "dayjs";
import { CheckCircle2, LucideMinusCircle, Download } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";

type TConsultationBookingForm = {
  consultationBooking: TConsultationBooking;
};

const noValue = "N/A";

export const ViewConsultationOrderForm: FC<TConsultationBookingForm> = ({
  consultationBooking,
}) => {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  return (
    <div className=" flex flex-col gap-12 @container p-4 rounded-sm">
      {/* Checkout Details */}
      <div className="">
        <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 mb-4">
          {t("customerDetails")}
          {/* Customer Details */}
        </h2>
        <div className=" grid grid-cols-1 @lg:grid-cols-2 gap-8">
          <div>
            <Label>
              {t("name")}
              {/* Name */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.customer.name ?? noValue}
            </div>
          </div>
          <div>
            <Label>
              {t("email")}
              {/* Email */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.customer.email ?? noValue}
            </div>
          </div>
          <div>
            <Label>
              {t("phone")}
              {/* Phone */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.customer.phone ?? noValue}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Details */}
      <div>
        <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 my-4">
          {/* Package Details */}
          {t("packageDetails")}
        </h2>
        <div className=" grid grid-cols-1 @lg:grid-cols-2 gap-8">
          <div>
            <Label>
              {t("tier")}
              {/* Tier */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.consultation.tier.toUpperCase() ?? noValue}
            </div>
          </div>
          <div>
            <Label>
              {t("numberOfDays")}
              {/* Number of Days */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.consultation.numberOfDays ?? noValue}
            </div>
          </div>
          <div>
            <Label>
              {t("price")}
              {/* Price */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.consultation.priceWithCurrency ?? noValue}
            </div>
          </div>
        </div>
      </div>

      {/* Form Details */}
      <div>
        <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 my-4">
          {/* Form Details */}
          {t("formDetails")}
        </h2>
        <div className=" flex flex-col gap-8">
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-8">
            <div>
              <Label>
                {t("startDate")}
                {/* Start Date */}
              </Label>
              <div className="p-2 rounded-md border text-sm">
                {consultationBooking.startDate ?? noValue}
              </div>
            </div>
            <div>
              <Label>
                {t("endDate")}
                {/* End Date */}
              </Label>
              <div className="p-2 rounded-md border text-sm">
                {consultationBooking.endDate ?? noValue}
              </div>
            </div>
            <div>
              <Label>
                {t("dateBooked")}
                {/* Date Booked */}
              </Label>
              <div className="p-2 rounded-md border text-sm">
                {consultationBooking.dateBooked ?? noValue}
              </div>
            </div>
          </div>
          <div>
            <Label>{t("travelClass")}</Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.class.toUpperCase() ?? noValue}
            </div>
          </div>
          <div>
            <Label>{t("whichAirport")}</Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.departureAirport ?? noValue}
            </div>
          </div>
          <div>
            <Label>{t("plusOne")}</Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.numberOfTravelers ?? noValue}
            </div>
          </div>
          <div>
            <Label>{t("budgetAmount")}</Label>
            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.budget ?? noValue}
            </div>
          </div>
          <div>
            <Label>{t("budgetPriority")}</Label>

            <div className=" p-2 rounded-md border text-sm">
              <div className="flex flex-col gap-2">
                <p>{t(consultationBooking.budgetPriority)}</p>
              </div>
            </div>
          </div>
          <div>
            <Label> {t("budgetToInclude")}</Label>
            <div className=" p-2 rounded-md border text-sm">
              <div className="flex flex-col gap-2">
                {consultationBooking.budgetIncludes.map((id, i) => (
                  <p key={i}>
                    {t(budgetIncludes.find((f) => f.id === id)?.label)}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label>{t("vacationType")}</Label>
            <div className=" p-2 rounded-md border text-sm">
              <div className="flex flex-col gap-2">
                <p>{t(consultationBooking.vacationType)}</p>
              </div>
            </div>
          </div>
          <div>
            <Label>{t("whichTypeOfAccomidation")}</Label>

            <div className="p-2 rounded-md border text-sm">
              {consultationBooking.accommodationType.map((val, i) => (
                <p key={i}>{val}</p>
              ))}
            </div>
          </div>
          <div>
            <Label>{t("ToyouAdventureIs")}</Label>
            <div className=" p-2 rounded-md border text-sm">
              <div className="flex flex-col gap-2">
                {consultationBooking.adventureMeaning.map((id, i) => (
                  <p key={i}>
                    {t(adventureToYouIs.find((f) => f.id === id)?.label)}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label>{t("whichTypeOfActivities")}</Label>
            <div className=" p-2 rounded-md border text-sm">
              <div className="flex flex-col gap-2">
                {consultationBooking.activities.map((act, i) => (
                  <p key={i}>
                    {t(activitiesOptions.find((f) => f.id === act)?.label)}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label>
              {
                t("ifYouHad")
                // "If you had to wake up at 5 am to chase a program/activity, which one would you wake up that early for?"
              }
            </Label>
            <div className=" p-2 rounded-md border text-sm">
              <p>{t(consultationBooking.morningActivity)}</p>
            </div>
          </div>
          <div>
            <Label>{t("whatIsTheBestTravelExperience")}</Label>
            <div className=" p-2 rounded-md border text-sm">
              <p>{consultationBooking.bestTravelExperience}</p>
            </div>
          </div>
          <div>
            <Label> {t("doYouHaveFears")}</Label>
            <div className=" p-2 rounded-md border text-sm">
              <p>{consultationBooking.phobias ?? noValue}</p>
            </div>
          </div>
          <div className=" grid @lg:grid-cols-2 gap-6">
            <div>
              <Label>Coupon Used</Label>
              <div className=" p-2 rounded-md border text-sm">
                <p>{consultationBooking.coupon?.code ?? noValue}</p>
              </div>
            </div>
          </div>
          <div>
            <Label>Invoice</Label>
            <div className="rounded-md overflow-clip border">
              <Table className="">
                <TableHeader className="">
                  <TableRow className="">
                    <TableHead className=" text-start ">{t("id")}</TableHead>
                    <TableHead className=" text-start ">
                      {t("amount")}
                    </TableHead>
                    <TableHead className=" text-start ">{t("vat")}</TableHead>
                    <TableHead className=" text-start ">
                      {t("isPaid")}
                    </TableHead>
                    <TableHead className=" text-start ">{t("date")}</TableHead>
                    <TableHead className=" text-start ">
                      {t("invoice")}
                    </TableHead>
                    <TableHead className=" text-start ">
                      {t("receipt")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="">
                  {consultationBooking.invoice && (
                    <TableRow className={cn()}>
                      <TableCell className="font-medium">
                        {consultationBooking.invoice.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatePrice({
                          locale,
                          price: consultationBooking.invoice.totalAmount,
                        })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {consultationBooking.invoice.vat}
                      </TableCell>
                      <TableCell className="font-medium">
                        {consultationBooking.invoice.isPaid ? (
                          <CheckCircle2 className="text-primary" />
                        ) : (
                          <LucideMinusCircle className="text-destructive" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {dayjs(
                          consultationBooking.invoice.receipt.created_at
                        ).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="text-start">
                        {consultationBooking.invoice.path ? (
                          <Link
                            className={cn(buttonVariants({ variant: "ghost" }))}
                            href={consultationBooking.invoice.path}
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
                        {consultationBooking.invoice.receipt.path ? (
                          <Link
                            className={cn(buttonVariants({ variant: "ghost" }))}
                            href={consultationBooking.invoice.receipt.path}
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

                  {!consultationBooking.invoice && (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-start">
                        {t("nothingFound")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <Separator />
          <h2 className="text-2xl text-destructive font-helveticaNeue font-black border-s-4 border-destructive ps-2">
            {t("dangerArea")}
          </h2>
          <div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col grow items-start">
                {consultationBooking && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="text-muted-foreground font-normal"
                      >
                        {t("deleteConsultationBooking")}
                        {/* Delete Consultation Booking */}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader className="gap-1">
                        <DialogTitle>{t("deleteAchievement")}</DialogTitle>
                        <DialogDescription className="gap-1 flex flex-wrap">
                          {t("areYouSureYouWantToDelete")}
                          {/* Are you sure you want to delete this booking? */}
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button className="" type="button" variant="ghost">
                            {t("close")}
                          </Button>
                        </DialogClose>
                        <>
                          {/* <Button
                            disabled={deleteMutation.isPending}
                            onClick={() => deleteMutation.mutate()}
                            type="button"
                            variant={"destructive"}
                          >
                            {deleteMutation.isPending && (
                              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                            )}
                            {t("deleteAchievement")}
                          </Button> */}
                        </>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
