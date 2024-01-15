"use client";

import { TCoupon } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ClipboardCopy,
  MoreHorizontal,
  ArrowUpDown,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<TCoupon>[] = [
  {
    accessorKey: "id",
    header: () => <DisplayTranslatedText text="id" translation="Dashboard" />,
  },
  {
    accessorKey: "code",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="code" translation="Dashboard" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex items-center gap-1 text-xs w-fit hover:cursor-copy group"
          onClick={() => {
            toast.message("Code copied to your clipboard.", {
              icon: <ClipboardCopy className="w-3 h-3" />,
            });
            navigator.clipboard.writeText(row.original.code);
          }}
        >
          {row.original.code}
          <span>
            <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <DisplayTranslatedText text="type" translation="Dashboard" />
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <Badge variant={"outline"} size={"sm"} className={cn("uppercase")}>
            <DisplayTranslatedText
              text={row.original.type}
              translation="Coupons"
            />
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "value",
    header: () => (
      <div className="min-w-[4rem]">
        <DisplayTranslatedText text="value" translation="Dashboard" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <Badge variant={"outline"} className="text-center">
            {row.original.type === "percentage"
              ? `${row.original.percentOff} %`
              : `${row.original.value} BHD`}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "applyTo",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <DisplayTranslatedText text="applyTo" translation="Dashboard" />
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <CouponCategory coupon={row.original} />;
    },
  },
  {
    accessorKey: "minPoints",
    header: () => (
      <div className="min-w-[5rem]">
        <DisplayTranslatedText text="minPoints" translation="Dashboard" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <Badge variant={"outline"}>{row.original.minPoints}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "maxPoints",
    header: () => (
      <div className="min-w-[5rem]">
        <DisplayTranslatedText text="maxPoints" translation="Dashboard" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="">
          <Badge variant={"outline"}>{row.original.maxPoints}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <AddNew />,
    cell: ({ row }) => <Actions coupon={row.original} />,
  },
];

import React from "react";

export const CouponCategory = ({ coupon }: { coupon: TCoupon }) => {
  const t = useTranslations("Coupons");
  return (
    <div className="">
      <Badge
        variant={coupon.applyTo === "adventure" ? "default" : "secondary"}
        size={"sm"}
        className={cn("uppercase")}
      >
        {t(coupon.applyTo)}
      </Badge>
    </div>
  );
};

export const AddNew = () => {
  const locale = useLocale();
  return (
    <Link
      className="flex flex-col items-center text-blue-500 text-xs gap-1 hover:bg-muted p-1 rounded-sm duration-100"
      href={`/${locale}/admin/journeys-miles/coupon/new`}
    >
      <PlusCircle className="w-4 h-4" />{" "}
      <DisplayTranslatedText text="add" translation="Adventures" />
    </Link>
  );
};

const Actions = ({ coupon }: { coupon: TCoupon }) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("openMenu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/journeys-miles/coupon/edit/${coupon.code}`}
            >
              {t("edit")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
