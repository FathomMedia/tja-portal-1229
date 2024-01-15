"use client";

import React, { useEffect, useMemo, useState } from "react";
import { TMeta, TPaginatedAdventures } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { DashboardSection } from "@/components/DashboardSection";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { isRtlLang } from "rtl-detect";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";

export const ViewAllAdventuresComponent = () => {
  const locale = useLocale();
  const t = useTranslations("Adventures");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Search
  const debouncedResults = useMemo(() => {
    return debounce((e: any) => setSearch(e.target.value), 300);
  }, [setSearch]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const {
    data: paginatedAdventures,
    isFetching: isFetchingPaginatedAdventures,
  } = useQuery<TPaginatedAdventures>({
    queryKey: ["/adventures", page, search],
    queryFn: () =>
      apiReqQuery({
        endpoint: `/adventures?page=${page}&search=${search}`,
        locale,
      }).then((res) =>
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
      <Input
        className="max-w-sm rounded-md"
        placeholder={t("search")}
        type="text"
        onChange={debouncedResults}
      />
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
      {/* Pagination */}
      {paginatedAdventures?.meta && (
        <TablePagination
          meta={paginatedAdventures.meta}
          onPageSelect={(goTO) => setPage(goTO)}
        />
      )}
    </DashboardSection>
  );
};

export const TablePagination = ({
  meta,
  onPageSelect,
}: {
  meta: TMeta;
  onPageSelect: (goTo: number) => void;
}) => {
  const locale = useLocale();
  return (
    <div className="flex items-center gap-3 p-2 w-full justify-center">
      {/* first */}
      <Button
        onClick={() => onPageSelect(1)}
        disabled={meta.pagination.current_page === 1}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        {!isRtlLang(locale) && <ChevronsLeft className="h-4 w-4" />}
        {isRtlLang(locale) && <ChevronsRight className="h-4 w-4" />}
      </Button>
      {/* prev */}
      <Button
        onClick={() => onPageSelect(meta.pagination.prev_page_number ?? 1)}
        disabled={!meta.pagination.prev_page_number}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        {!isRtlLang(locale) && <ChevronLeft className="h-4 w-4" />}
        {isRtlLang(locale) && <ChevronRight className="h-4 w-4" />}
        <span className="hidden sm:inline">Previous</span>
      </Button>
      <Select
        onValueChange={(val) => onPageSelect(Number(val))}
        value={meta.current_page.toString()}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Page" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(
            { length: meta.pagination.total_pages },
            (_, i) => i + 1
          ).map((page, i) => (
            <SelectItem key={i} value={page.toString()}>
              {page}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() =>
          onPageSelect(
            meta.pagination.next_page_number ?? meta.pagination.total_pages
          )
        }
        disabled={!meta.pagination.next_page_number}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        <span className="hidden sm:inline">Next</span>
        {isRtlLang(locale) && <ChevronLeft className="h-4 w-4" />}
        {!isRtlLang(locale) && <ChevronRight className="h-4 w-4" />}
      </Button>
      {/* last */}
      <Button
        onClick={() => onPageSelect(meta.pagination.total_pages)}
        disabled={meta.pagination.current_page === meta.pagination.total_pages}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        {isRtlLang(locale) && <ChevronsLeft className="h-4 w-4" />}
        {!isRtlLang(locale) && <ChevronsRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};
