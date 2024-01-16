"use client";

import { TConsultationBooking } from "@/lib/types";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import {
  CheckCircle2,
  ClipboardCopy,
  LucideMinusCircle,
  MoreHorizontal,
  ArrowUpDown,
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

export const columns: ColumnDef<TConsultationBooking>[] = [
  {
    accessorKey: "id",
    header: () => (
      <DisplayTranslatedText text="id" translation="Consultation" />
    ),
  },
  {
    accessorKey: "tier",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="tier" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        // className={(row.original.consultation.tier == "silver" && "bg-[#C0C0C0]",
        //   row.original.consultation.tier == "gold" && "bg-[#FFD700]")
        // }
      >
        {row.original.consultation.tier.toUpperCase()}
      </Badge>
    ),
  },
  {
    accessorKey: "numberOfDays",
    header: () => (
      <div className="">
        <DisplayTranslatedText text="numberOfDays" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => (
      <p className=" text-center">{row.original.consultation.numberOfDays}</p>
    ),
  },
  {
    accessorKey: "startDate",
    header: () => (
      <DisplayTranslatedText text="startDate" translation="Consultation" />
    ),
    cell: ({ row }) => <p>{row.original.startDate}</p>,
  },
  {
    accessorKey: "endDate",
    header: () => (
      <DisplayTranslatedText text="endDate" translation="Consultation" />
    ),
    cell: ({ row }) => <p>{row.original.endDate}</p>,
  },
  {
    accessorKey: "dateBooked",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="dateBooked" translation="Consultation" />
      </div>
    ),
  },

  {
    accessorKey: "priceWithCurrency",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="price" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.consultation.priceWithCurrency}</p>,
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <Actions consultationBooking={row.original} />,
  // },
];

const Actions = ({
  consultationBooking,
}: {
  consultationBooking: TConsultationBooking;
}) => {
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
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/orders/consultation/${consultationBooking.id}`}
            >
              View Form
            </Link>
          </DropdownMenuItem> */}
          {/* <DropdownMenuItem asChild>
            <Link
              className="text-info w-full rounded-sm bg-info/0 hover:text-info hover:bg-info/10  border-transparent hover:border-transparent"
              href={`${consultationBooking.invoice.path}`}
            >
              Download Invoice
            </Link>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ConsultationName = ({
  consultationBooking,
}: {
  consultationBooking: TConsultationBooking;
}) => {
  const locale = useLocale();

  return (
    <Link
      className="group-hover:text-secondary"
      href={`/${locale}/admin/orders/consultation/${consultationBooking.id}`}
    >
      {consultationBooking.customer.name}
    </Link>
  );
};
