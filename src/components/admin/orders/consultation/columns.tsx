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
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const columns: ColumnDef<TConsultationBooking>[] = [
  {
    accessorKey: "id",
    header: () => (
      <DisplayTranslatedText text="id" translation="Consultation" />
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="name" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => <ConsultationName consultationBooking={row.original} />,
  },
  {
    accessorKey: "email",
    header: () => (
      <DisplayTranslatedText text="email" translation="Consultation" />
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
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="phone" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => {
      return <p>{row.original.customer.phone}</p>;
    },
  },
  {
    accessorKey: "tier",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="tier" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => (
      <Badge variant="outline">
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
        <DisplayTranslatedText
          text="priceWithCurrency"
          translation="Consultation"
        />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.consultation.priceWithCurrency}</p>,
  },
  {
    accessorKey: "isCancelled",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DisplayTranslatedText
            text="isCancelled"
            translation="Consultation"
          />
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.isCancelled ? (
        <div className=" flex justify-center">
          <Badge className=" uppercase" variant={"destructive"}>
            <DisplayTranslatedText
              text="dateBooked"
              translation="Consultation"
            />
          </Badge>
        </div>
      ) : (
        <div className=" flex items-center justify-center">-</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions consultationBooking={row.original} />,
  },
];

const Actions = ({
  consultationBooking,
}: {
  consultationBooking: TConsultationBooking;
}) => {
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
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/orders/consultation/${consultationBooking.id}`}
            >
              {t("viewForm")}
            </Link>
          </DropdownMenuItem>
          {consultationBooking?.invoice?.path && (
            <DropdownMenuItem asChild>
              <Link
                className="text-info w-full rounded-sm bg-info/0 hover:text-info hover:bg-info/10  border-transparent hover:border-transparent"
                href={`${consultationBooking.invoice.path}`}
              >
                {t("downloadInvoice")}
              </Link>
            </DropdownMenuItem>
          )}
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
