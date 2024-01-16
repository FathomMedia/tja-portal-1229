"use client";
import { AdventureBookingsOrdersComponent } from "@/components/admin/orders/adventures/AdventureBookingsOrdersComponent";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { apiReqQuery } from "@/lib/apiHelpers";
import { TAdventure } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  const { data: adventure, isFetching: isFetchingAdventure } =
    useQuery<TAdventure>({
      queryKey: [`/adventures/${slug}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/adventures/${slug}`, locale }).then((res) =>
          res.json().then((resData) => resData.data)
        ),
    });

  return (
    <div className="flex flex-col gap-4">
      {isFetchingAdventure && (
        <Skeleton className="h-60 overflow-clip rounded-md max-w-sm" />
      )}
      {!isFetchingAdventure && adventure && (
        <Link
          className="h-60 overflow-clip group relative rounded-md max-w-sm"
          href={`/${locale}/admin/products/adventures/edit/${adventure.slug}`}
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
              {!adventure.isFull && adventure.availableSeats <= 5 && (
                <Badge
                  variant={"outline"}
                  size={"sm"}
                  className="text-muted w-fit text-xs"
                >
                  {adventure.availableSeats} {t("seatsLeft")}
                </Badge>
              )}
              <h5 className="mb-2 text-2xl font-helveticaNeue font-black text-primary-foreground">
                <p>{adventure.title}</p>
              </h5>
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
              src={adventure.image ?? "/assets/images/adventure.jpg"}
            />
          </div>
        </Link>
      )}
      <AdventureBookingsOrdersComponent slug={slug} />
    </div>
  );
}
