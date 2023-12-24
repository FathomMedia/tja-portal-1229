"use client";

import { Badge } from "@/components/ui/badge";
import { TCustomer } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardCopy, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";

export const columns: ColumnDef<TCustomer>[] = [
  {
    accessorKey: "customerId",
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
      <DisplayTranslatedText text="emailAddress" translation="SignUp" />
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
    accessorKey: "phone",
    header: () => <DisplayTranslatedText text="Phone" translation="SignUp" />,
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
            navigator.clipboard.writeText(row.original.phone);
          }}
        >
          {row.original.phone}
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
    accessorKey: "points",
    header: () => (
      <DisplayTranslatedText text="availablePoints" translation="Dashboard" />
    ),
    cell: ({ row }) => {
      return <Badge variant={"outline"}>{row.original.points}</Badge>;
    },
  },
  {
    accessorKey: "level",
    header: () => (
      <DisplayTranslatedText text="level" translation="Dashboard" />
    ),
    cell: ({ row }) => {
      return <Badge>{row.original.level.name}</Badge>;
    },
  },
  {
    accessorKey: "joinedAt",
    header: () => (
      <div className="min-w-[5rem]">
        <DisplayTranslatedText text="joinedAt" translation="Dashboard" />
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <DisplayTranslatedText text="status" translation="Dashboard" />
    ),
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <Badge variant={customer.isSuspended ? "destructive" : "info"}>
          <DisplayTranslatedText
            text={customer.status}
            translation="Dashboard"
          />
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const customer = row.original;

      return <Actions customer={customer} />;
    },
  },
];

const Actions = ({ customer }: { customer: TCustomer }) => {
  const locale = useLocale();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/user/handleSuspend`, {
        method: "POST",
        body: JSON.stringify({
          customerId: customer.customerId,
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
        toast.success(message);
        queryClient.invalidateQueries({ queryKey: ["/customers"] });
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
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/customers/edit/${customer.customerId}`}
            >
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/loyalty?customer=${customer.customerId}`}
            >
              Loyalty
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            {customer.isSuspended ? (
              <Button
                disabled={mutation.isPending}
                onClick={() => mutation.mutate()}
                className="text-info w-full rounded-sm bg-info/0 hover:text-info hover:bg-info/10  border-transparent hover:border-transparent"
                variant="outline"
              >
                {mutation.isPending && (
                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                )}
                Unsuspend
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="text-destructive w-full rounded-sm bg-destructive/0 hover:text-destructive hover:bg-destructive/10  border-transparent hover:border-transparent"
                    variant="outline"
                  >
                    Suspend
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader className="gap-1">
                    <DialogTitle>Suspend Customer</DialogTitle>
                    <DialogDescription className="gap-1 flex flex-wrap">
                      Are you sure you want to suspend
                      <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                        {customer.email}
                      </span>
                      <span>?</span>
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button className="" type="button" variant="ghost">
                        Close
                      </Button>
                    </DialogClose>
                    <>
                      <Button
                        disabled={mutation.isPending}
                        onClick={() => mutation.mutate()}
                        variant={"destructive"}
                      >
                        {mutation.isPending && (
                          <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                        )}
                        Suspend
                      </Button>
                    </>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
