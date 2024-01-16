"use client";

import { TAdventureBooking } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  ClipboardCopy,
  LucideMinusCircle,
  MoreHorizontal,
  ArrowUpDown,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<TAdventureBooking>[] = [
  {
    accessorKey: "id",
    header: () => <DisplayTranslatedText text="id" translation="Dashboard" />,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="name" translation="Adventures" />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.customer.name}</p>,
  },
  {
    accessorKey: "email",
    header: () => (
      <DisplayTranslatedText text="email" translation="Adventures" />
    ),
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex items-center gap-1 text-xs w-fit hover:cursor-copy group"
          onClick={() => {
            toast.message("Email copied to your clipboard.", {
              icon: <ClipboardCopy className="w-3 h-3" />,
            });
            navigator.clipboard.writeText(row.original.customer.email);
          }}
        >
          {row.original.customer.email}
          <span>
            <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => (
      <DisplayTranslatedText text="phone" translation="Adventures" />
    ),
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex items-center gap-1 text-xs w-fit hover:cursor-copy group"
          onClick={() => {
            toast.message("Phone copied to your clipboard.", {
              icon: <ClipboardCopy className="w-3 h-3" />,
            });
            navigator.clipboard.writeText(row.original.customer.phone);
          }}
        >
          {row.original.customer.phone}
          <span>
            <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: "adventureTitle",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="adventureTitle" translation="Adventures" />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.adventure.title}</p>,
  },
  {
    accessorKey: "image",
    header: () => (
      <div className="min-w-[2.5rem]">
        <DisplayTranslatedText text="image" translation="Adventures" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <Avatar className="w-10 h-10">
          {row.original.adventure.image && (
            <AvatarImage src={row.original.adventure.image} />
          )}
          <AvatarFallback>
            {<X className="w-4 h-4 text-muted-foreground" />}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  {
    accessorKey: "isFullyPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DisplayTranslatedText text="isFullyPaid" translation="Adventures" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return row.original.isFullyPaid ? (
        <CheckCircle2 className="text-primary w-5 h-5 mx-auto " />
      ) : (
        <LucideMinusCircle className="text-destructive w-5 h-5 mx-auto " />
      );
    },
  },
  {
    accessorKey: "isCancelled",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DisplayTranslatedText text="isCancelled" translation="Adventures" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.isCancelled ? (
        <div className="flex justify-center">
          <Badge className=" uppercase" variant={"destructive"}>
            <DisplayTranslatedText text="cancelled" translation="Adventures" />
          </Badge>
        </div>
      ) : (
        <div className=" flex items-center justify-center">-</div>
      );
    },
  },
  {
    accessorKey: "adventureStartDate",
    header: () => (
      <div className="min-w-[6rem]">
        <DisplayTranslatedText
          text="adventureStartDate"
          translation="Adventures"
        />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.adventure.startDate}</p>,
  },
  {
    accessorKey: "adventureEndDate",
    header: () => (
      <div className="min-w-[6rem]">
        <DisplayTranslatedText
          text="adventureEndDate"
          translation="Adventures"
        />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.adventure.endDate}</p>,
  },
  {
    accessorKey: "dateBooked",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="dateBooked" translation="Adventures" />
      </div>
    ),
  },
  {
    accessorKey: "totalPriceWithCurrency",
    header: () => (
      <div className="min-w-[10rem]">
        <DisplayTranslatedText
          text="totalPriceWithCurrency"
          translation="Adventures"
        />
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions adventureBooking={row.original} />,
  },
];

const Actions = ({
  adventureBooking,
}: {
  adventureBooking: TAdventureBooking;
}) => {
  const locale = useLocale();
  const t = useTranslations("Orders");

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
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/members/customers/edit/${adventureBooking.customer.id}`}
            >
              {t("viewCustomer")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/orders/adventures/${adventureBooking.id}`}
            >
              {t("viewBooking")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
