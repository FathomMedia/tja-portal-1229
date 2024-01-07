"use client";

import { TConsultation } from "@/lib/types";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLocale } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Badge } from "@/components/ui/badge";
import { ConsultationForm } from "./ConsultationForm";

export const columns: ColumnDef<TConsultation>[] = [
  {
    accessorKey: "id",
    header: () => (
      <DisplayTranslatedText text="id" translation="Consultation" />
    ),
  },
  {
    accessorKey: "tierType",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="tier" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => {
      return <Badge variant={"outline"}>{row.original.tier}</Badge>;
    },
  },
  {
    accessorKey: "numberOfDays",
    header: () => (
      <DisplayTranslatedText text="No. of Days" translation="Consultation" />
    ),
    cell: ({ row }) => {
      return <p className=" ">{row.original.numberOfDays}</p>;
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <DisplayTranslatedText text="Price" translation="Consultation" />
    ),
    cell: ({ row }) => {
      return <p className="">{row.original.priceWithCurrency}</p>;
    },
  },
  {
    id: "actions",
    header: () => <AddNew />,
    cell: ({ row }) => <Actions consultation={row.original} />,
  },
];

export const AddNew = () => {
  // const locale = useLocale();
  return (
    <div className="">
      <ConsultationForm />
    </div>
  );
};

const Actions = ({ consultation }: { consultation: TConsultation }) => {
  const locale = useLocale();

  return (
    <div className=" w-full flex justify-end">
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
          <DropdownMenuItem asChild>
            <ConsultationForm consultation={consultation} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
