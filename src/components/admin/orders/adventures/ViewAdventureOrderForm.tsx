"use client";

import React, { FC } from "react";

import { useLocale, useTranslations } from "next-intl";
import { TAdventureBookingOrder } from "@/lib/types";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { AdventureInvoices } from "@/components/booking/AdventureInvoices";
import { format } from "date-fns";
import { Icons } from "@/components/ui/icons";
import { cn, formatePrice, parseDateFromAPI } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Blocks, CheckCircle2 } from "lucide-react";

type TAdventureBookingForm = {
  adventureBooking: TAdventureBookingOrder;
};

const noValue = "N/A";

export const ViewAdventureOrderForm: FC<TAdventureBookingForm> = ({
  adventureBooking,
}) => {
  const locale = useLocale();
  const t = useTranslations("Adventures");
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/book/cancel-adventure-booking`, {
        method: "PUT",
        body: JSON.stringify({
          id: adventureBooking.id,
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
          queryKey: [`/adventure-bookings/${adventureBooking.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/adventure-bookings`],
        });
        toast.success(message);
      } else {
        console.log(data);
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/book/mark-adventure-booking-as-paid`, {
        method: "PUT",
        body: JSON.stringify({
          id: adventureBooking.id,
        }),
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(data) {
      console.log(adventureBooking);
      console.log(adventureBooking.id);
      if (data.ok) {
        const { message } = await data.json();
        queryClient.invalidateQueries({
          queryKey: [`/adventure-bookings/${adventureBooking.id}`],
        });
        queryClient.invalidateQueries({
          queryKey: [`/adventure-bookings`],
        });
        toast.success(message);
      } else {
        console.log(data);
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  return (
    <div className=" flex flex-col gap-12 @container p-4 rounded-sm">
      {adventureBooking && adventureBooking.isCancelled && (
        <div>
          <Alert className="text-secondary-foreground border-secondary-foreground bg-secondary">
            <AlertCircleIcon className="h-4 w-4 !text-primary-foreground" />
            <AlertTitle>{t("bookingCancelled")}</AlertTitle>
            <AlertDescription className="text-xs">
              {t("thisBookingWasCancelledByAnAdmin")}
            </AlertDescription>
          </Alert>
        </div>
      )}
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
              {adventureBooking.customer.name ?? noValue}
            </div>
          </div>
          <div>
            <Label>
              {t("email")}
              {/* Email */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {adventureBooking.customer.email ?? noValue}
            </div>
          </div>
          <div>
            <Label>
              {t("phone")}
              {/* Phone */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {adventureBooking.customer.phone ?? noValue}
            </div>
          </div>
        </div>
      </div>

      {/* Adventure Details */}
      <div>
        <h2 className="text-lg text-primary font-semibold border-s-4 border-primary ps-2 my-4">
          {/* Adventure Details */}
          {t("adventureDetails")}
        </h2>
        <div className=" grid grid-cols-1 @lg:grid-cols-2 gap-8">
          <div>
            <Label>
              {t("title")}
              {/* Title */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {adventureBooking.adventure.title ?? noValue}
            </div>
          </div>
          <div>
            <Label>
              {t("price")}
              {/* Price */}
            </Label>
            <div className="p-2 rounded-md border text-sm">
              {adventureBooking.totalPriceWithCurrency ?? noValue}
            </div>
          </div>
          <div>
            <Label>{t("startDate")}</Label>
            <div className="p-2 rounded-md border text-sm">
              {adventureBooking.adventure.startDate ?? noValue}
            </div>
          </div>
          <div>
            <Label>{t("endDate")}</Label>
            <div className="p-2 rounded-md border text-sm">
              {adventureBooking.adventure.endDate ?? noValue}
            </div>
          </div>
        </div>
        {adventureBooking.addOns && adventureBooking.addOns.length > 0 && (
          <div className="flex flex-col items-start my-4 gap-4">
            <div className="flex flex-col gap-1">
              <h3 className=" text-primary font-semibold text-xl flex items-center gap-1">
                <span>
                  <Blocks className="w-4 h-4 text-primary" />
                </span>{" "}
                {t("addons")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("chosenAddons")}
              </p>
            </div>
            <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 gap-3 w-full ">
              {adventureBooking.addOns.map((add, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-4 rounded-md select-none w-full min-h-[5rem] bg-background gap-3 text-foreground  flex justify-between border-2 border-secondary"
                  )}
                >
                  <div className="flex flex-col gap-3 justify-between">
                    <div>
                      <p className="text-sm font-medium">{add.name}</p>
                    </div>
                    <p className="text-sm font-bold text-secondary">
                      {formatePrice({ locale, price: add.price })}
                    </p>
                  </div>
                  {/* select icon */}
                  <div className={cn("duration-150 h-fit")}>
                    <CheckCircle2 className="w-5 h-5  bg-secondary text-secondary-foreground rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4 @4xl:col-span-2" />
          </div>
        )}
      </div>

      {/* Form Details */}
      <div className=" flex flex-col gap-8">
        <div>
          <Label>
            {t("dateBooked")}
            {/* Date Booked */}
          </Label>
          <div className="p-2 rounded-md border text-sm">
            {format(
              parseDateFromAPI(adventureBooking.dateBooked.toString()),
              "dd/MM/yyyy"
            ) ?? noValue}
          </div>
        </div>
        <div>
          <Label>{t("whyDidYouChooseThisDistention")}</Label>
          {/* "Why did you choose this destination?..." */}
          {/* //TODO this is spelled incorrectly in the message folder */}
          <div className="p-2 rounded-md border text-sm">
            {adventureBooking.reason}
          </div>
        </div>

        <div>
          <Label>{t("invoice")}</Label>
          <div className="rounded-md overflow-clip border">
            <AdventureInvoices
              invoices={[
                { type: "partial", invoice: adventureBooking.partialInvoice },
                {
                  type: "remaining",
                  invoice: adventureBooking.remainingInvoice,
                },
                { type: "full", invoice: adventureBooking.fullInvoice },
              ]}
            />
          </div>
        </div>

        {/* markAsPaidMutation */}
        {
          <div className="flex flex-col gap-6">
            <Separator />
            <h2 className="text-2xl text-destructive font-helveticaNeue font-black border-s-4 border-destructive ps-2">
              {t("dangerArea")}
            </h2>
            <div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col divide-y grow gap-4 items-start">
                  {adventureBooking && (
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-muted-foreground font-normal"
                          >
                            {!adventureBooking.isCancelled
                              ? t("cancelAdventureBooking")
                              : t("restoreAdventureBooking")}
                            {/* Cancel Adventure Booking */}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader className="gap-1">
                            <DialogTitle>
                              {!adventureBooking.isCancelled
                                ? t("cancelAdventureBooking")
                                : t("restoreAdventureBooking")}
                            </DialogTitle>
                            <DialogDescription className="gap-1 flex flex-col flex-wrap">
                              <p>
                                {!adventureBooking.isCancelled
                                  ? t("areYouSureYouWantToCancel")
                                  : t("areYouSureYouWantToRestore")}
                              </p>
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
                                variant={
                                  !adventureBooking.isCancelled
                                    ? "destructive"
                                    : "info"
                                }
                              >
                                {cancelMutation.isPending && (
                                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                                )}
                                {!adventureBooking.isCancelled
                                  ? t("cancelBooking")
                                  : t("restoreBooking")}
                              </Button>
                            </>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {adventureBooking && !adventureBooking.isFullyPaid && (
                    <div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            className="text-muted-foreground font-normal"
                          >
                            {t("markAsPaid")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader className="gap-1">
                            <DialogTitle>{t("markAsPaid")}</DialogTitle>
                            <DialogDescription className="gap-1 flex flex-wrap">
                              <p>
                                {t("areYouSureYouWantToMarkThisBookingAsPaid")}
                              </p>
                              <p>{t("thisActionCannotBeUndone")}</p>
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
                                disabled={markAsPaidMutation.isPending}
                                onClick={() => markAsPaidMutation.mutate()}
                                type="button"
                                variant={"destructive"}
                              >
                                {markAsPaidMutation.isPending && (
                                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                                )}
                                {t("markAsPaid")}
                              </Button>
                            </>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};
