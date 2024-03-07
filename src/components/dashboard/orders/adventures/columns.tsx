"use client";

import {
  TAdventure,
  TAdventureBooking,
  TAdventureBookingOrder,
} from "@/lib/types";
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
    accessorKey: "adventureTitle",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="adventureTitle" translation="Adventures" />
      </div>
    ),
    cell: ({ row }) => <Title booking={row.original} />,
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
    accessorKey: "statusEnum",
    header: ({ column }) => {
      return <DisplayTranslatedText text="status" translation="Adventures" />;
    },

    cell: ({ row }) => {
      var variant:
        | "info"
        | "default"
        | "secondary"
        | "destructive"
        | "outline"
        | null
        | undefined;

      switch (row.original.statusEnum) {
        case "reserved":
          variant = "info";
          break;
        case "partiallyPaid":
          variant = "secondary";
          break;
        case "fullyPaid":
          variant = "default";
          break;
        case "cancelled":
          variant = "destructive";
          break;
        case "notPaid":
          variant = "outline";
          break;
        default:
          variant = "outline";
          break;
      }

      return (
        <Badge className="whitespace-nowrap" variant={variant}>
          {row.original.status}
        </Badge>
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
      <div className="min-w-[8rem]">
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
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/dashboard/adventures/bookings/${adventureBooking.id}`}
            >
              {t("viewBooking")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Title = ({ booking }: { booking: TAdventureBooking }) => {
  const locale = useLocale();

  return (
    <Link
      className="group-hover:text-secondary"
      href={`/${locale}/dashboard/adventures/bookings/${booking.id}`}
    >
      {booking.adventure.title}
    </Link>
  );
};
