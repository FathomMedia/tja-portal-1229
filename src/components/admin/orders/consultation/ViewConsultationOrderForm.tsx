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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { DashboardSection } from "@/components/DashboardSection";

type TConsultationBookingForm = {
  consultationBooking: TConsultationBooking;
  isCustomer?: boolean;
};

const noValue = "N/A";

export const ViewConsultationOrderForm: FC<TConsultationBookingForm> = ({
  consultationBooking,
  isCustomer,
}) => {
  const locale = useLocale();
  const t = useTranslations("Consultation");
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/book/cancel-consultation-booking`, {
        method: "PUT",
        body: JSON.stringify({
          id: consultationBooking.id,
        }),
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        queryClient.invalidateQueries({
          queryKey: [`/consultation-bookings/${consultationBooking.id}`],
        });
        toast.success(message);
        // push(`/${locale}/admin/achievements`);
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  return (
    <DashboardSection title={"View Consultation"}>
      <div className=" flex flex-col gap-12 @container p-4 rounded-sm">
        {/* Checkout Details */}
        <div className="">
          <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 mb-4">
            {t("customerDetails")}
          </h2>
          <div className=" grid grid-cols-1 @lg:grid-cols-2 gap-8">
            <div>
              <Label>{t("name")}</Label>
              <Input
                disabled
                value={consultationBooking.customer?.name ?? ""}
              />
            </div>
            <div>
              <Label>{t("email")}</Label>
              <Input
                disabled
                value={consultationBooking.customer?.email ?? ""}
              />
            </div>
            <div>
              <Label>{t("phone")}</Label>
              <Input
                disabled
                value={consultationBooking.customer?.phone ?? ""}
              />
            </div>
          </div>
        </div>

        {/* Consultation Details */}
        <div>
          <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 my-4">
            {t("packageDetails")}
          </h2>
          <div className=" grid grid-cols-1 @lg:grid-cols-2 gap-8">
            <div>
              <Label>{t("package")}</Label>
              <Input
                disabled
                value={
                  consultationBooking.consultation.tier.toUpperCase() ?? ""
                }
              />
            </div>
            <div>
              <Label>{t("numberOfDays")}</Label>
              <Input
                disabled
                value={consultationBooking.consultation.numberOfDays ?? ""}
              />
            </div>
            <div>
              <Label>{t("price")}</Label>
              <Input
                disabled
                value={consultationBooking.consultation.priceWithCurrency ?? ""}
              />
            </div>
          </div>
        </div>

        {/* Form Details */}
        <div>
          <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 my-4">
            {t("formDetails")}
          </h2>
          <div className=" flex flex-col gap-8">
            <div className="grid grid-cols-1 @lg:grid-cols-2 gap-8">
              <div>
                <Label>{t("startDate")}</Label>
                <Input disabled value={consultationBooking.startDate ?? ""} />
              </div>
              <div>
                <Label>{t("endDate")}</Label>
                <Input disabled value={consultationBooking.endDate ?? ""} />
              </div>
              <div>
                <Label>{t("dateBooked")}</Label>
                <Input disabled value={consultationBooking.dateBooked ?? ""} />
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
                <p>{consultationBooking.bestTravelExperience ?? noValue}</p>
              </div>
            </div>
            <div>
              <Label> {t("doYouHaveFears")}</Label>
              <div className=" p-2 rounded-md border text-sm">
                <p>{consultationBooking.phobias ?? noValue}</p>
              </div>
            </div>
            {/* <div className=" grid @lg:grid-cols-2 gap-6">
              <div>
                <Label>Coupon Used</Label>
                <div className=" p-2 rounded-md border text-sm">
                  <p>{consultationBooking.coupon?.code ?? noValue}</p>
                </div>
              </div>
            </div> */}
            <div>
              {/* <Label>{t("coupon")}</Label>
              <Input
                disabled
                value={consultationBooking.coupon?.code ?? "N/A"}
              /> */}
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
                        {t("singleCoupon")}
                      </TableHead>
                      <TableHead className=" text-start ">
                        {t("isPaid")}
                      </TableHead>
                      <TableHead className=" text-start ">
                        {t("date")}
                      </TableHead>
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
                          {consultationBooking.invoice.coupon}
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
                              className={cn(
                                buttonVariants({ variant: "ghost" })
                              )}
                              href={consultationBooking.invoice.path}
                              target="_blank"
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
                              className={cn(
                                buttonVariants({ variant: "ghost" })
                              )}
                              href={consultationBooking.invoice.receipt.path}
                              target="_blank"
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
            {!consultationBooking.isCancelled && !isCustomer && (
              <div className=" pt-4 flex flex-col gap-6">
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
                              {t("cancelConsultationBooking")}
                              {/* Cancel Consultation Booking */}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader className="gap-1">
                              <DialogTitle>
                                {t("deleteAchievement")}
                              </DialogTitle>
                              <DialogDescription className="gap-1 flex flex-wrap">
                                {t("areYouSureYouWantToCancel")}
                                {/* Are you sure you want to cancel this booking? */}
                              </DialogDescription>
                            </DialogHeader>

                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <Button
                                  className=""
                                  type="button"
                                  variant="ghost"
                                >
                                  {t("close")}
                                </Button>
                              </DialogClose>
                              <>
                                <Button
                                  disabled={cancelMutation.isPending}
                                  onClick={() => cancelMutation.mutate()}
                                  type="button"
                                  variant={"destructive"}
                                >
                                  {cancelMutation.isPending && (
                                    <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                                  )}
                                  {t("cancelConsultation")}
                                </Button>
                              </>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardSection>
  );
};
