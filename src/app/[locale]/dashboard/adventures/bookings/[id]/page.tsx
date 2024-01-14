"use client";
import { TAdventureBookingOrder } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  Globe,
  Plane,
  Download,
  Phone,
  ArrowRightCircleIcon,
  File,
} from "lucide-react";
import { cn, formatePrice, parseDateFromAPI } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import { useSearchParams } from "next/navigation";
import { AdventureInvoices } from "@/components/booking/AdventureInvoices";
import { PayRemaining } from "@/components/booking/PayRemainingAdventure";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  const searchParams = useSearchParams();
  const isRedirected = Boolean(searchParams.get("redirected"));

  const { data: booking, isFetching: isFetchingAdventure } =
    useQuery<TAdventureBookingOrder>({
      queryKey: [`/adventure-bookings/${id}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/adventure-bookings/${id}`, locale }).then(
          (res) => res.json().then((resData) => resData.data)
        ),
    });

  const formSchema = z.object({
    passport_id: z.any().optional(),
    ticket: z.any().optional(),
    other_document: z.any().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();

      if (values.passport_id) {
        formData.append("passport_id", values.passport_id);
      }
      if (values.ticket) {
        formData.append("ticket", values.ticket);
      }
      if (values.other_document) {
        formData.append("other_document", values.other_document);
      }

      return fetch(`/api/adventure/update-adventure`, {
        method: "PUT",
        headers: {
          "Accept-Language": locale,
        },
        body: formData,
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/adventure-bookings"] });
        queryClient.invalidateQueries({
          queryKey: ["/profile/adventure-bookings"],
        });
        queryClient.invalidateQueries({ queryKey: ["/profile/bookings"] });
        booking &&
          queryClient.invalidateQueries({
            queryKey: [`/adventure-bookings/${booking.id}`],
          });
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <div className="flex flex-col w-full @container">
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
        <div className="flex flex-col w-full gap-6">
          {/* Alerts */}
          <div className="flex flex-col w-full gap-4">
            {isRedirected && (
              <Alert className="text-primary-foreground border-primary-foreground bg-primary">
                <CheckCircle2 className="h-4 w-4 !text-primary-foreground " />
                <AlertTitle>{t("bookingConfirmed")}</AlertTitle>
                <AlertDescription className="text-xs">
                  {t("yourBookingIsConfirmd")}
                </AlertDescription>
              </Alert>
            )}
            {!booking.isFullyPaid && (
              <Alert className="text-secondary-foreground border-secondary-foreground bg-secondary">
                <DollarSign className="h-4 w-4 !text-primary-foreground" />
                <AlertTitle>{t("pendingPayment")}</AlertTitle>
                <AlertDescription className="text-xs">
                  {`${t("completeYourPayment")} ${booking.adventure.title} ${t(
                    "before"
                  )} ${dayjs(parseDateFromAPI(booking.adventure.startDate))
                    .subtract(40, "days")
                    .format("DD-MM-YYYY")} ${t("toSecureSpot")}`}

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
                <Link
                  href={booking.adventure.link ?? "#"}
                  className="font-black flex items-center gap-1 font-helveticaNeue w-fit hover:underline text-primary md:text-3xl text-xl"
                >
                  {booking.adventure.title}{" "}
                  <span>
                    <Globe className="mb-1" />
                  </span>
                </Link>
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
                    href={booking.adventure.link ?? "#"}
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

          {/* Trip Toolkit */}
          <div className="grid grid-cols-1 @4xl:grid-cols-2 items-center gap-4">
            <div className="flex flex-col gap-1">
              <h3 className=" text-primary font-semibold text-xl flex items-center gap-1">
                <span>
                  <Plane className="w-4 h-4 fill-primary" />
                </span>{" "}
                {t("tripToolkit")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("importantResourcesForASeamlessAndUnforgettableJourney")}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {booking.adventure.travelGuide && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xs" }),
                    "text-primary border-primary hover:text-primary flex items-center gap-1 text-sm rounded-full"
                  )}
                  href={booking.adventure.travelGuide}
                >
                  {t("travelGuide")}{" "}
                  <span>
                    <Download className="w-4 h-4 text-center" />
                  </span>
                </Link>
              )}
              {booking.adventure.fitnessGuide && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xs" }),
                    "text-primary border-primary hover:text-primary flex items-center gap-1 text-sm rounded-full"
                  )}
                  href={booking.adventure.fitnessGuide}
                >
                  {t("fitnessGuide")}{" "}
                  <span>
                    <Download className="w-4 h-4 text-center" />
                  </span>
                </Link>
              )}
              {booking.adventure.packingList && (
                <Link
                  className={cn(
                    buttonVariants({ variant: "outline", size: "xs" }),
                    "text-primary border-primary hover:text-primary flex items-center gap-1 text-sm rounded-full"
                  )}
                  href={booking.adventure.packingList}
                >
                  {t("packingList")}{" "}
                  <span>
                    <Download className="w-4 h-4 text-center" />
                  </span>
                </Link>
              )}
            </div>
          </div>
          <Separator className="my-4" />
          {/* Upload Documents */}
          <div className="grid grid-cols-1 @4xl:grid-cols-2 items-start gap-4">
            <div className="flex flex-col gap-1">
              <h3 className=" text-primary font-semibold text-xl flex items-center gap-1">
                <span>
                  <File className="w-4 h-4 fill-primary " />
                </span>{" "}
                {t("uploadYourDocuments")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t(
                  "makeSureToUploadAllTheRequiredDocumentsToEnsureASmoothTrip"
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid gap-6 grid-cols-1 items-end"
                >
                  {/* fields */}
                  <div className="flex gap-3 items-end bg-muted/30 rounded-2xl border p-3">
                    <FormField
                      control={form.control}
                      name="passport_id"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <div className="flex items-center justify-between">
                            <FormLabel>{t("passport_id")}</FormLabel>
                            {booking?.passportId && (
                              <Link
                                href={booking.passportId}
                                target="_blank"
                                className={cn(
                                  buttonVariants({
                                    variant: "info",
                                    size: "xs",
                                  })
                                )}
                              >
                                {t("view")}
                              </Link>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              dir="ltr"
                              className=" border-primary"
                              {...field}
                              value={undefined}
                              onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                  field.onChange(file);
                                }
                              }}
                              type="file"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 items-end bg-muted/30 rounded-2xl border p-3">
                    <FormField
                      control={form.control}
                      name="ticket"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <div className="flex items-center justify-between">
                            <FormLabel>{t("ticket")}</FormLabel>
                            {booking?.ticket && (
                              <Link
                                href={booking.ticket}
                                target="_blank"
                                className={cn(
                                  buttonVariants({
                                    variant: "info",
                                    size: "xs",
                                  })
                                )}
                              >
                                {t("view")}
                              </Link>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              dir="ltr"
                              className=" border-primary"
                              {...field}
                              value={undefined}
                              onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                  field.onChange(file);
                                }
                              }}
                              type="file"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-3 items-end bg-muted/30 rounded-2xl border p-3">
                    <FormField
                      control={form.control}
                      name="other_document"
                      render={({ field }) => (
                        <FormItem className=" w-full">
                          <div className="flex items-center justify-between">
                            <FormLabel>{t("other_document")}</FormLabel>
                            {booking?.otherDocument && (
                              <Link
                                href={booking.otherDocument}
                                target="_blank"
                                className={cn(
                                  buttonVariants({
                                    variant: "info",
                                    size: "xs",
                                  })
                                )}
                              >
                                {t("view")}
                              </Link>
                            )}
                          </div>
                          <FormControl>
                            <Input
                              dir="ltr"
                              className=" border-primary"
                              {...field}
                              value={undefined}
                              onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                  field.onChange(file);
                                }
                              }}
                              type="file"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <Separator className="my-4" />
          {/* Get In Touch */}
          <div className="grid grid-cols-1 @4xl:grid-cols-2 items-center gap-4">
            <div className="flex flex-col gap-1">
              <h3 className=" text-primary font-semibold text-xl flex items-center gap-1">
                <span>
                  <Phone className="w-4 h-4 fill-primary" />
                </span>{" "}
                {t("getInTouch")}
              </h3>
              <p className="text-muted-foreground text-sm">
                {t("haveAnyQuestionsAboutYourTripDonTHesitateToReachOut")}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                className={cn(
                  buttonVariants({ variant: "default", size: "xs" }),
                  " flex items-center gap-1 text-sm rounded-full"
                )}
                href={"#"}
              >
                {t("whatsApp")}{" "}
                <span>
                  <ArrowRightCircleIcon className="w-4 h-4 text-center rtl:rotate-180" />
                </span>
              </Link>
              <Link
                className={cn(
                  buttonVariants({ variant: "default", size: "xs" }),
                  " flex items-center gap-1 text-sm rounded-full"
                )}
                href={"#"}
              >
                {t("feedbackForm")}{" "}
                <span>
                  <ArrowRightCircleIcon className="w-4 h-4 text-center rtl:rotate-180" />
                </span>
              </Link>
            </div>
          </div>
          <Separator className="my-4" />
          {/* Invoices */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
              {t("invoices")}
            </h2>
            <AdventureInvoices
              invoices={[
                {
                  type: "partial",
                  invoice: booking.partialInvoice,
                },
                {
                  type: "remaining",
                  invoice: booking.remainingInvoice,
                },
                {
                  type: "full",
                  invoice: booking.fullInvoice,
                },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}
