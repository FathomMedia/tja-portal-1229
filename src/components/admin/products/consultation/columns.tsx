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
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Badge } from "@/components/ui/badge";
import { ConsultationForm } from "./ConsultationForm";

export const columns: ColumnDef<TConsultation>[] = [
  {
    accessorKey: "id",
    header: () => (
      <DisplayTranslatedText text="id" translation="Consultations" />
    ),
  },
  {
    accessorKey: "packageType",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="packageType" translation="Consultations" />
      </div>
    ),
    cell: ({ row }) => {
      return <Badge variant={"outline"}>{row.original.tier}</Badge>;
    },
  },
  {
    accessorKey: "numberOfDays",
    header: () => (
      <DisplayTranslatedText text="numberOfDays" translation="Consultations" />
    ),
    cell: ({ row }) => {
      return <p className=" text-center">{row.original.numberOfDays}</p>;
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <DisplayTranslatedText text="price" translation="Consultations" />
    ),
    cell: ({ row }) => {
      return <p className=" text-center">{row.original.priceWithCurrency}</p>;
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
  const t = useTranslations("Consultations");

  return (
    <div className=" w-full flex justify-end">
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
            <ConsultationForm consultation={consultation} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
