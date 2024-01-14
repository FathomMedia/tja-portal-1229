"use client";
import { TPaginatedAdventures } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardSection } from "@/components/DashboardSection";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const locale = useLocale();

  const t = useTranslations("Adventures");

  const {
    data: paginatedAdventures,
    isFetching: isFetchingPaginatedAdventures,
  } = useQuery<TPaginatedAdventures>({
    queryKey: ["/adventures"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/adventures", locale }).then((res) =>
        res.json().then((resData) => {
          return resData;
        })
      ),
  });

  return (
    <DashboardSection
      title={t("adventures")}
      className="flex @container flex-col gap-2"
    >
      {isFetchingPaginatedAdventures && (
        <div className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-4">
          <Skeleton className="w-full h-96" />
          <Skeleton className="w-full h-96" />
          <Skeleton className="w-full h-96" />
        </div>
      )}
      <div className="grid grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 gap-4">
        {paginatedAdventures &&
          !isFetchingPaginatedAdventures &&
          paginatedAdventures.data?.map((adventure, i) => (
            <Link
              className="h-96 overflow-clip group relative rounded-md "
              href={`adventures/${adventure.slug}`}
              key={i}
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
                      className="text-muted w-fit text-xs"
                    >
                      {t("fullyBooked")}
                      size={"sm"}
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
                  <h5 className="mb-2 text-2xl min-h-[4rem] font-helveticaNeue font-black text-primary-foreground">
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
          ))}
      </div>
      {!paginatedAdventures && !isFetchingPaginatedAdventures && (
        <div className="text-center text-muted-foreground bg-muted p-4 rounded-md">
          <p>{t("failedToRetrieveAdventures")}</p>
        </div>
      )}
    </DashboardSection>
  );
}
