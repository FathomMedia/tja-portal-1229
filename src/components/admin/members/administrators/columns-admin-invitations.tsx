"use client";

import { Badge } from "@/components/ui/badge";
import { TAdminInvitation } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  ClipboardCopy,
  LucideMinusCircle,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DisplayTranslatedText } from "@/components/Helper";
import { useLocale, useTranslations } from "next-intl";
import { InviteAdminForm } from "./InviteAdminForm";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const columnsAdminInvitations: ColumnDef<TAdminInvitation>[] = [
  {
    accessorKey: "adminId",
    header: () => <DisplayTranslatedText text="id" translation="Dashboard" />,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="Name" translation="SignUp" />
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: () => (
      <div className="min-w-[5rem]">
        <DisplayTranslatedText text="emailAddress" translation="SignUp" />
      </div>
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
            navigator.clipboard.writeText(row.original.email);
          }}
        >
          {row.original.email}
          <span>
            <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: "gender",
    header: () => <DisplayTranslatedText text="gender" translation="SignUp" />,
    cell: ({ row }) => {
      return (
        <Badge
          className={
            row.original.gender === "M"
              ? "bg-info/50 text-foreground hover:bg-info/30 hover:text-foreground"
              : "bg-pink-300/50 text-foreground hover:bg-pink-300/30 hover:text-foreground"
          }
        >
          {row.original.gender === "M" ? (
            <DisplayTranslatedText text="male" translation="SignUp" />
          ) : (
            <DisplayTranslatedText text="female" translation="SignUp" />
          )}
        </Badge>
      );
    },
  },
  {
    accessorKey: "invitedBy",
    header: () => (
      <div className="min-w-[5rem]">
        <DisplayTranslatedText text="invitedBy" translation="Dashboard" />
      </div>
    ),
  },
  {
    accessorKey: "invitedAt",
    header: () => (
      <div className="min-w-[5rem]">
        <DisplayTranslatedText text="invitedAt" translation="Dashboard" />
      </div>
    ),
  },
  {
    accessorKey: "isAccepted",
    header: () => (
      <DisplayTranslatedText text="isAccepted" translation="Dashboard" />
    ),
    cell: ({ row }) => {
      return row.original.isAccepted ? (
        <CheckCircle2 className="text-primary w-5 h-5 mx-auto " />
      ) : (
        <LucideMinusCircle className="text-destructive w-5 h-5 mx-auto " />
      );
    },
  },
  {
    id: "actions",
    header: () => <AddNew />,
    cell: ({ row }) => <Actions adminInvitation={row.original} />,
  },
];

export const AddNew = () => {
  const locale = useLocale();
  return <InviteAdminForm />;
};

const Actions = ({
  adminInvitation,
}: {
  adminInvitation: TAdminInvitation;
}) => {
  const locale = useLocale();
  const t = useTranslations("Customer");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: TAdminInvitation) => {
      console.log(
        "🚀 ~ file: columns-admin-invitations.tsx:203 ~ values.adminId:",
        values.adminId
      );
      console.log(
        "🚀 ~ file: columns-admin-invitations.tsx:203 ~ values.userId:",
        values.userId
      );
      return fetch(`/api/administrator/delete-admin-invite`, {
        method: "POST",
        body: JSON.stringify({
          ...values,
        }),
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        queryClient.invalidateQueries({ queryKey: ["/admins/invitations"] });
        toast.success(message);
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

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
          <DropdownMenuItem asChild>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  {t("Revoke Invitation")}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke this invitation?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button
                    className=" text-sm bg-transparent text-red-400 hover:bg-transparent"
                    onClick={() => {
                      mutation.mutate(adminInvitation);
                    }}
                  >
                    Yes, revoke
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
