"use client";

import { TAchievement, TCoupon, TLevel } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ClipboardCopy,
  MoreHorizontal,
  ArrowUpDown,
  PlusCircle,
  ImageOff,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: ColumnDef<TAchievement>[] = [
  {
    accessorKey: "id",
    header: () => <DisplayTranslatedText text="id" translation="Dashboard" />,
  },
  {
    accessorKey: "title",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="title" translation="Dashboard" />
      </div>
    ),
    cell: ({ row }) => <Title achievement={row.original} />,
  },
  {
    accessorKey: "badge",
    header: () => (
      <div className="min-w-[2.5rem]">
        <DisplayTranslatedText text="badge" translation="Adventures" />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <Avatar className="w-10 h-10">
          {row.original.badge && (
            <AvatarImage className="object-cover" src={row.original.badge} />
          )}
          <AvatarFallback>
            {<ImageOff className="w-4 h-4 text-muted-foreground" />}
          </AvatarFallback>
        </Avatar>
      );
    },
  },

  {
    accessorKey: "description",
    header: () => (
      <div className="min-w-[5rem]">
        <DisplayTranslatedText text="description" translation="Dashboard" />
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <AddNew />,
    cell: ({ row }) => <Actions achievement={row.original} />,
  },
];

export const AddNew = () => {
  const locale = useLocale();
  return (
    <Link
      className="flex flex-col items-center text-blue-500 text-xs gap-1 hover:bg-muted p-1 rounded-sm duration-100"
      href={`/${locale}/admin/achievements/new`}
    >
      <PlusCircle className="w-4 h-4" />{" "}
      <DisplayTranslatedText text="add" translation="Dashboard" />
    </Link>
  );
};

const Actions = ({ achievement }: { achievement: TAchievement }) => {
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
            <Link href={`/${locale}/admin/achievements/edit/${achievement.id}`}>
              {t("edit")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const Title = ({ achievement }: { achievement: TAchievement }) => {
  const locale = useLocale();

  return (
    <Link
      className="group-hover:text-secondary group-hover:underline"
      href={`/${locale}/admin/achievements/edit/${achievement.id}`}
    >
      {achievement.title}
    </Link>
  );
};
