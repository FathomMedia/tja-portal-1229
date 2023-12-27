"use client";

import { TAdventure, TAdventureBooking } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  ClipboardCopy,
  LucideMinusCircle,
  MoreHorizontal,
  ArrowUpDown,
  Circle,
  PlusCircle,
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
import { useLocale } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<TAdventure>[] = [
  {
    accessorKey: "id",
    header: () => <DisplayTranslatedText text="id" translation="Dashboard" />,
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="title" translation="Adventures" />
      </div>
    ),
  },

  {
    accessorKey: "country",
    header: () => (
      <DisplayTranslatedText text="country" translation="Adventures" />
    ),
  },
  {
    accessorKey: "capacity",
    header: () => (
      <DisplayTranslatedText text="capacity" translation="Adventures" />
    ),
    cell: ({ row }) => {
      return <Badge variant={"outline"}>{row.original.capacity}</Badge>;
    },
  },
  {
    accessorKey: "priceWithCurrency",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="price" translation="Adventures" />
      </div>
    ),
  },
  {
    accessorKey: "partialPriceWithCurrency",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="partialPrice" translation="Adventures" />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.partialPriceWithCurrency ?? "-"}</p>,
  },
  {
    accessorKey: "gender",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="gender" translation="Adventures" />
      </div>
    ),
    // cell: ({ row }) => <p>{row.original.partialPriceWithCurrency ?? "-"}</p>,
  },
  {
    accessorKey: "isUpcoming",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DisplayTranslatedText text="upcoming" translation="Adventures" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return row.original.isUpcoming ? (
        <CheckCircle2 className="text-secondary w-5 h-5 mx-auto " />
      ) : (
        <Circle className="text-muted w-5 h-5 mx-auto " />
      );
    },
  },
  {
    accessorKey: "isFull",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DisplayTranslatedText text="full" translation="Adventures" />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      return row.original.isFull ? (
        <CheckCircle2 className="text-secondary w-5 h-5 mx-auto " />
      ) : (
        <Circle className="text-muted w-5 h-5 mx-auto " />
      );
    },
  },

  {
    accessorKey: "startDate",
    header: () => (
      <DisplayTranslatedText text="startDate" translation="Adventures" />
    ),
    cell: ({ row }) => <p>{row.original.startDate}</p>,
  },
  {
    accessorKey: "endDate",
    header: () => (
      <DisplayTranslatedText text="endDate" translation="Adventures" />
    ),
    cell: ({ row }) => <p>{row.original.endDate}</p>,
  },
  {
    accessorKey: "giftPoints",
    header: () => (
      <div className="">
        <DisplayTranslatedText text="giftPoints" translation="Adventures" />
      </div>
    ),
    cell: ({ row }) => {
      return <Badge variant={"outline"}>{row.original.giftPoints}</Badge>;
    },
  },
  {
    accessorKey: "slug",
    header: () => (
      <DisplayTranslatedText text="slug" translation="Adventures" />
    ),
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex items-center gap-1 text-xs w-fit hover:cursor-copy group"
          onClick={() => {
            toast.message("Slug copied to your clipboard.", {
              icon: <ClipboardCopy className="w-3 h-3" />,
            });
            navigator.clipboard.writeText(row.original.slug);
          }}
        >
          {row.original.slug}
          <span>
            <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
          </span>
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: () => <AddNew />,
    cell: ({ row }) => <Actions adventure={row.original} />,
  },
];

export const AddNew = () => {
  const locale = useLocale();
  return (
    <Link
      className="flex flex-col items-center text-blue-500 text-xs gap-1 hover:bg-muted p-1 rounded-sm duration-100"
      href={`/${locale}/admin/products/adventures/new`}
    >
      <PlusCircle className="w-4 h-4" />{" "}
      <DisplayTranslatedText text="add" translation="Adventures" />
    </Link>
  );
};

const Actions = ({ adventure }: { adventure: TAdventure }) => {
  const locale = useLocale();

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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/products/adventures/edit/${adventure.slug}`}
            >
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/products/adventures/bookings/${adventure.slug}`}
            >
              View Bookings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};