"use client";

import React from "react";

import { TAdventure, TConsultation, TOrder, TOrders } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle,
  CheckCircle2,
  Divide,
  ImageOff,
  LucideMinusCircle,
  MoreHorizontal,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const LatestsOrdersComponent = () => {
  const locale = useLocale();

  const t = useTranslations("Dashboard");

  const { data: orders, isFetching } = useQuery<TOrders>({
    queryKey: [`/bookings`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/bookings`, locale }).then((res) => res.json()),
  });

  return (
    <div className="flex @container flex-col gap-4 w-full">
      {/* <div className="rounded-md overflow-clip border">
        <Table className="">
          <TableHeader className="">
            <TableRow className="">
              <TableHead className=" text-start ">{t("id")}</TableHead>
              <TableHead className=" text-start ">{t("name")}</TableHead>
              <TableHead className=" text-start ">{t("email")}</TableHead>
              <TableHead className=" text-start ">{t("phone")}</TableHead>
              <TableHead className=" text-start ">{t("type")}</TableHead>
              <TableHead className=" text-start ">{t("details")}</TableHead>
              <TableHead className=" text-start ">{t("isFullyPaid")}</TableHead>
              <TableHead className=" text-start ">{t("bookingDate")}</TableHead>
              <TableHead className=" text-start "></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {isFetching && (
              <>
                <TableRow>
                  <TableCell colSpan={8} className="h-20 w-full text-start">
                    <Skeleton className=" w-full h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} className="h-20 w-full text-start">
                    <Skeleton className=" w-full h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={8} className="h-20 w-full text-start">
                    <Skeleton className=" w-full h-full" />
                  </TableCell>
                </TableRow>
              </>
            )}
            {orders &&
              orders.data &&
              !isFetching &&
              orders.data.map((order, i) => {
                const isAdventure = order.type === "adventure";
                const consultation: TConsultation =
                  order.details as TConsultation;
                const adventure: TAdventure = order.details as TAdventure;

                return (
                  <TableRow key={i} className={cn()}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="font-medium">
                      {order.customer.name}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customer.email}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.customer.phone}
                    </TableCell>
                    <TableCell className="font-medium">
                      {t(order.type)}
                    </TableCell>
                    <TableCell className="text-start">
                      {isAdventure ? adventure.title : consultation.tier}
                    </TableCell>
                    <TableCell className="text-start">
                      {order.isFullyPaid || order.type === "consultation" ? (
                        <CheckCircle2 className="text-primary" />
                      ) : (
                        <LucideMinusCircle className="text-destructive" />
                      )}
                    </TableCell>
                    <TableCell className="text-start">
                      {order.dateBooked}
                    </TableCell>
                    <TableCell>
                      <Actions order={order} />
                    </TableCell>
                  </TableRow>
                );
              })}
            {orders &&
              !isFetching &&
              (!orders.data || orders.data?.length === 0) && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-start">
                    {t("nothingFound")}
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
        <Separator />
        <div className="text-center text-sm p-4 text-muted-foreground">
          {t("latestOrders")}
        </div>
      </div> */}

      {isFetching && (
        <>
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </>
      )}

      {!isFetching &&
        orders &&
        orders.data.map((order, i) => {
          const isAdventure = order.type === "adventure";
          const consultation: TConsultation = order.details as TConsultation;
          const adventure: TAdventure = order.details as TAdventure;

          return (
            <Link
              href={
                isAdventure
                  ? `/${locale}/admin/orders/adventures/${order.id}`
                  : `/${locale}/admin/orders/consultation/${order.id}`
              }
              className="flex gap-3 w-full  flex-col @md:flex-row @md:items-center hover:bg-muted/60 bg-muted/20 p-2 rounded-lg border-border border hover:border-border duration-300"
              key={i}
            >
              <div className="flex gap-3 grow items-center">
                <Avatar className="w-10 h-10">
                  {
                    <AvatarImage
                      className="object-cover"
                      src={
                        isAdventure
                          ? adventure.image ?? "/assets/images/adventure.jpg"
                          : "/assets/images/consultation"
                      }
                    />
                  }
                  <AvatarFallback>
                    {<ImageOff className="w-4 h-4 text-muted-foreground" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex text-sm flex-col grow ">
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-muted-foreground text-xs">
                    {order.customer.email}
                  </p>
                </div>
              </div>
              <div className="flex text-sm @md:items-end gap-1 @md:flex-col w-fit">
                {order.isFullyPaid ? (
                  <Badge className="bg-teal-400/40 w-fit text-ebg-teal-400 hover:bg-teal-400/30 hover:text-ebg-teal-400 font-light">
                    {t("paid")}
                    <CheckCircle className="ms-1 w-[0.65rem] h-[0.65rem]" />
                  </Badge>
                ) : (
                  <Badge className="bg-secondary/40 w-fit text-secondary hover:bg-secondary/30 hover:text-secondary font-light">
                    {t("pendingPayment")}
                  </Badge>
                )}
                <Badge
                  className="w-fit font-light bg-background"
                  variant={"outline"}
                >
                  {isAdventure ? t("adventure") : t("consultation")}
                </Badge>
              </div>
              {/* <div></div> */}
            </Link>
          );
        })}
    </div>
  );
};

const Actions = ({ order }: { order: TOrder }) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={
                order.type === "adventure"
                  ? `/${locale}/admin/orders/adventures/${order.id}`
                  : `/${locale}/admin/orders/consultation/${order.id}`
              }
            >
              {t("view")}
            </Link>
          </DropdownMenuItem>
          {/* <DropdownMenuItem asChild>
            <Button
              onClick={() => {}}
              className="text-info w-full rounded-sm bg-info/0 hover:text-info hover:bg-info/10  border-transparent hover:border-transparent"
              variant="outline"
            >
              
              Download Invoice
            </Button>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
