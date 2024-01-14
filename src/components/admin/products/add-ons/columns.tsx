"use client";

import { TAddon } from "@/lib/types";

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
import { AddOnForm } from "./AddOnForm";

export const columns: ColumnDef<TAddon>[] = [
  {
    accessorKey: "id",
    header: () => <DisplayTranslatedText text="id" translation="AddOn" />,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="name" translation="AddOn" />
      </div>
    ),
    cell: ({ row }) => {
      return <Badge variant={"outline"}>{row.original.name}</Badge>;
    },
  },
  {
    id: "actions",
    header: () => <AddNew />,
    cell: ({ row }) => <Actions addOn={row.original} />,
  },
];

export const AddNew = () => {
  // const locale = useLocale();
  return (
    <div className="">
      <AddOnForm />
    </div>
  );
};

const Actions = ({ addOn }: { addOn: TAddon }) => {
  const locale = useLocale();
  const t = useTranslations("AddOn");

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
            <AddOnForm addOn={addOn} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
