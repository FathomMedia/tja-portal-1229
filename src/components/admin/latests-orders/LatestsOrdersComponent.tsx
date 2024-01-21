"use client";

import React from "react";

import { TAdventure, TConsultation, TOrder, TOrders } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, ImageOff, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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
      {isFetching && (
        <>
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-16" />
        </>
      )}

      {!isFetching && orders && orders.data?.length === 0 && (
        <div className="p-4 bg-muted text-muted-foreground text-sm rounded-md h-20 flex flex-col justify-center items-center">
          <p>{t("nothingFound")}</p>
        </div>
      )}

      {!isFetching &&
        orders &&
        orders.data.map((order, i) => {
          const isAdventure = order.type === "adventure";
          const consultation: TConsultation = order.details as TConsultation;
          const adventure: TAdventure = order.details as TAdventure;

          return (
            <HoverCard key={i}>
              <HoverCardTrigger>
                <Link
                  href={
                    isAdventure
                      ? `/${locale}/admin/orders/adventures/${order.id}`
                      : `/${locale}/admin/orders/consultation/${order.id}`
                  }
                  className="flex gap-3 w-full flex-col @md:flex-row @md:items-center hover:bg-muted/60 bg-muted/0 p-2 rounded-lg border-border/0 border hover:border-border duration-300"
                >
                  <div className="flex gap-3 grow items-center">
                    <Avatar className="w-10 h-10">
                      {
                        <AvatarImage
                          className="object-cover"
                          src={
                            isAdventure
                              ? adventure.image ??
                                "/assets/images/adventure.jpg"
                              : "/assets/images/consultation.jpg"
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
                        {order.dateBooked}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap text-sm @md:items-end gap-1 @md:flex-col w-fit">
                    <div className="flex items-center gap-2">
                      {order.isCancelled && (
                        <Badge variant={"destructive"} className="font-light">
                          {t("cancelled")}
                        </Badge>
                      )}
                      {!isAdventure && order.isPaid && (
                        <Badge className="bg-teal-400/40 w-fit text-ebg-teal-400 hover:bg-teal-400/30 hover:text-ebg-teal-400 font-light">
                          {t("paid")}
                          <CheckCircle className="ms-1 w-[0.65rem] h-[0.65rem]" />
                        </Badge>
                      )}

                      {isAdventure &&
                        (order.isFullyPaid ? (
                          <Badge className="bg-teal-400/40 w-fit text-ebg-teal-400 hover:bg-teal-400/30 hover:text-ebg-teal-400 font-light">
                            {t("paid")}
                            <CheckCircle className="ms-1 w-[0.65rem] h-[0.65rem]" />
                          </Badge>
                        ) : (
                          <Badge className="bg-secondary/40 w-fit text-secondary hover:bg-secondary/30 hover:text-secondary font-light">
                            {t("pendingPayment")}
                          </Badge>
                        ))}
                    </div>
                    <Badge
                      className="w-fit font-light bg-background text-ellipsis"
                      variant={"outline"}
                    >
                      <p className="max-w-[8rem] w-full line-clamp-1">
                        {isAdventure ? adventure.title : consultation.tier}
                      </p>
                    </Badge>
                  </div>
                </Link>
              </HoverCardTrigger>
              <HoverCardContent className="isolate ">
                {isAdventure && (
                  <div className="flex flex-col gap-4">
                    <Link
                      className="w-full aspect-video overflow-clip group relative rounded-md max-w-xs"
                      href={`/${locale}/admin/products/adventures/bookings/${adventure.slug}`}
                    >
                      <div className="flex flex-col h-full p-4 justify-between">
                        <div className="text-sm flex items-center gap-3 uppercase text-muted">
                          <Avatar className="w-12  h-12 min-w-fit">
                            {adventure.continentImage && (
                              <AvatarImage
                                className="object-cover"
                                src={adventure.continentImage}
                              />
                            )}
                            <AvatarFallback className=" text-muted rounded-full bg-transparent border">
                              {adventure.continent.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <p>{adventure.continent}</p>
                        </div>
                        <div className="flex flex-col flex-1 gap-3 justify-end">
                          {adventure.isFull && (
                            <Badge
                              variant={"outline"}
                              size={"sm"}
                              className="text-muted w-fit text-xs"
                            >
                              {t("fullyBooked")}
                            </Badge>
                          )}
                          {!adventure.isFull &&
                            adventure.availableSeats <= 5 && (
                              <Badge
                                variant={"outline"}
                                size={"sm"}
                                className="text-muted w-fit text-xs"
                              >
                                {adventure.availableSeats} {t("seatsLeft")}
                              </Badge>
                            )}

                          <div className="flex items-center gap-2 flex-wrap text-muted text-sm">
                            <p>{adventure.startDate}</p>
                            <span>{"->"}</span>
                            <p>{adventure.endDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -z-10 inset-0 bg-gradient-to-t from-black to-primary  group-hover:scale-105 duration-500">
                        <Image
                          className="h-full w-full object-cover group-hover:opacity-60 opacity-40 duration-500"
                          width={440}
                          height={240}
                          alt={adventure.title}
                          src={
                            adventure.image ?? "/assets/images/adventure.jpg"
                          }
                        />
                      </div>
                    </Link>
                    <div className="flex flex-col gap-2">
                      <h5 className="text-lg font-semibold text-primary">
                        <p>{adventure.title}</p>
                      </h5>
                      <div>
                        <Badge variant={"outline"}>{adventure.gender}</Badge>
                      </div>
                      <h5 className="text-xl text-primary font-bold font-helveticaNeue">
                        <p>{adventure.priceWithCurrency}</p>
                      </h5>
                    </div>
                  </div>
                )}
              </HoverCardContent>
            </HoverCard>
          );
        })}
    </div>
  );
};
