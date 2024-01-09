"use client";
import { TAdventureBookingOrder } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  MessageCircle,
  MessageSquareDashed,
  CheckCircle2,
  LucideMinusCircle,
  Download,
} from "lucide-react";
import { cn, formatePrice } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import dayjs from "dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import EditorViewer from "@/components/editor/EditorViewer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Adventures");

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
                    href={`/${locale}/dashboard/adventures/bookings/${booking.id}`}
                    type="button"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" })
                    )}
                  >
                    {/* {t("downloadReceipt")} <Download className="ms-2 w-4 h-4" /> */}
                    {t("viewMore")}
                  </Link>
                )}
                {!booking.isFullyPaid && (
                  <Link
                    href={`/${locale}/dashboard/adventures/bookings/${booking.id}`}
                    type="button"
                    className={
                      (cn(buttonVariants({ variant: "ghost", size: "sm" })),
                      "text-secondary underline hover:text-secondary hover:bg-secondary/10")
                    }
                  >
                    {t("completePayment")}
                  </Link>
                )}

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
              <AccordionItem className="@container" value="item-2">
                <AccordionTrigger>{t("packingList")}</AccordionTrigger>
                <AccordionContent className="bg-white/50 rounded-md p-4 @xl:p-10 prose-sm mb-2">
                  <EditorViewer data={booking.adventure.package} />
                </AccordionContent>
              </AccordionItem>
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
                        {dayjs(
                          booking.partialInvoice.receipt.created_at
                        ).format("DD/MM/YYYY")}
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
                        {booking.partialInvoice.receipt.path ? (
                          <Link
                            className={cn(buttonVariants({ variant: "ghost" }))}
                            href={booking.partialInvoice.receipt.path}
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
                        {dayjs(
                          booking.remainingInvoice.receipt.created_at
                        ).format("DD/MM/YYYY")}
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
                        {booking.remainingInvoice.receipt.path ? (
                          <Link
                            className={cn(buttonVariants({ variant: "ghost" }))}
                            href={booking.remainingInvoice.receipt.path}
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
                        {dayjs(booking.fullInvoice.receipt.created_at).format(
                          "DD/MM/YYYY"
                        )}
                      </TableCell>
                      <TableCell className="text-start">
                        {booking.fullInvoice.path ? (
                          <Link
                            className={cn(buttonVariants({ variant: "ghost" }))}
                            href={booking.fullInvoice.path}
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
                        {booking.fullInvoice.receipt.path ? (
                          <Link
                            className={cn(buttonVariants({ variant: "ghost" }))}
                            href={booking.fullInvoice.receipt.path}
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
          </div>
        </div>
      )}
    </div>
  );
}
