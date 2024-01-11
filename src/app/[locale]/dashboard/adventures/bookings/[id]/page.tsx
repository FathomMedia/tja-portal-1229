"use client";
import { TAdventureBookingOrder } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  MessageCircle,
  MessageSquareDashed,
  CheckCircle2,
  LucideMinusCircle,
  Download,
  DollarSign,
} from "lucide-react";
import { cn, formatePrice } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    <div className="flex flex-col w-full">
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
                <h3 className="font-black font-helveticaNeue text-primary md:text-3xl text-xl">
                  {booking.adventure.title}
                </h3>
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
          {/* description */}
          {booking.adventure.description && (
            <p className="text-sm p-4 bg-muted/50 rounded-sm text-muted-foreground">
              {booking.adventure.description}
            </p>
          )}
          {/* flight details */}
          <div></div>
          {/* details */}
          <div>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("itinerary")}</AccordionTrigger>
                <AccordionContent>
                  {t("itineraryContent")}{" "}
                  {
                    <Link
                      className={cn("text-primary hover:underline font-bold")}
                      href={booking.adventure.link}
                    >
                      {t("yourAdventureHere")}
                    </Link>
                  }
                </AccordionContent>
              </AccordionItem>
              {/* <AccordionItem className="@container" value="item-2">
                <AccordionTrigger>{t("packingList")}</AccordionTrigger>
                <AccordionContent className="bg-white/50 rounded-md p-4 @xl:p-10 prose-sm mb-2">
                  <EditorViewer data={booking.adventure.package} />
                </AccordionContent>
              </AccordionItem> */}
              <AccordionItem value="item-3">
                <AccordionTrigger>{t("links")}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center flex-wrap gap-4">
                    <Link
                      href={"#"}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-fit gap-2 uppercase"
                      )}
                    >
                      <MessageSquareDashed className="w-5 h-5" />
                      <p className="group-hover:underline">
                        {t("feedbackForm")}
                      </p>
                    </Link>
                    <Link
                      href={"#"}
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-fit gap-2 uppercase"
                      )}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <p className="group-hover:underline">{t("whatsapp")}</p>
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Invoices */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
              {t("invoices")}
            </h2>
            <AdventureInvoices
              invoices={[
                booking.partialInvoice,
                booking.remainingInvoice,
                booking.fullInvoice,
              ]}
              // partialInvoice={booking.partialInvoice}
              // remainingInvoice={booking.remainingInvoice}
              // fullInvoice={booking.fullInvoice}
            />
          </div>
        </div>
      )}
    </div>
  );
}

import React, { FC, useEffect, useState } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AdventureInvoices } from "@/components/booking/AdventureInvoices";
type TPayRemaining = {
  booking: TAdventureBookingOrder;
  text?: string;
  className?: string;
};

export const PayRemaining: FC<TPayRemaining> = ({
  booking,
  text,
  className,
}) => {
  const t = useTranslations("Adventures");
  const locale = useLocale();
  const { push } = useRouter();

  const formSchema = z.object({
    paymentMethod: z.enum(["benefitpay", "applepay", "card"]),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "card",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      var dataToRequest = {
        payment_method: values.paymentMethod,
      };
      return fetch(`/api/book/adventure-remaining`, {
        method: "POST",
        body: JSON.stringify({
          bookingId: booking.id,
          dataToRequest: dataToRequest,
        }),
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const paymentSession = await data.json();

        if (paymentSession?.session?.PaymentURL) {
          push(paymentSession?.session?.PaymentURL);
        } else {
          toast.error(t("couldntCreateAPaymentSession"), { duration: 6000 });
        }
      } else {
        toast.error(t("couldntCreateAPaymentSession"), { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size={"sm"}
          className={cn(
            "text-secondary underline hover:text-secondary hover:bg-secondary/10 px-1 py-0",
            className
          )}
        >
          {text ?? t("completePayment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10"
          >
            <DialogHeader className="gap-1">
              <DialogTitle>{t("completePayment")}</DialogTitle>
              <DialogDescription className="gap-1 flex flex-wrap">
                {t("payTheRemainingAmountOf")}
                {booking.remainingInvoice &&
                  formatePrice({
                    locale,
                    price: booking.remainingInvoice?.totalAmount,
                  })}
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="@container/paymentMethod w-full  bg-white/50 p-3 rounded-2xl">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      defaultValue={field.value}
                      className="grid @sm/paymentMethod:grid-cols-2  grid-cols-1 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="card"
                          id="card"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Icons.card className="h-6 w-6" />
                          {t("creditCard")}
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="benefitpay"
                          id="benefitpay"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="benefitpay"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="mb-3">
                            <Icons.benefitPay className="h-6 w-6" />
                          </div>
                          {t("benefitPay")}
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  {field.value === "benefitpay" && (
                    <p className="text-muted-foreground text-sm">
                      {t("benefitPay-debit-card-for-Bahraini-only")}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button className="" type="button" variant="ghost">
                  {t("close")}
                </Button>
              </DialogClose>
              <>
                <Button
                  disabled={mutation.isPending}
                  type="submit"
                  variant={"secondary"}
                >
                  {mutation.isPending && (
                    <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                  )}
                  {t("payNow")}
                </Button>
              </>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
