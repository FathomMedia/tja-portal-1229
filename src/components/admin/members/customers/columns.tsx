"use client";

import { Badge } from "@/components/ui/badge";
import { TCustomer } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  ClipboardCopy,
  MinusCircle,
  MoreHorizontal,
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
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Icons } from "@/components/ui/icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

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
  const t = useTranslations("Customer");

  const queryClient = useQueryClient();

  const formSchema = z.object({
    points: z.number().min(1, t("pointsAreRequired")),
    operation: z.string(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: 100,
      operation: "",
    },
  });

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

  const managePointsMutation = useMutation({
    mutationFn: ({
      points,
      operation,
    }: {
      points: number;
      operation: string;
    }) => {
      return fetch(`/api/user/managePoints`, {
        method: "POST",
        body: JSON.stringify({
          customerId: customer.customerId,
          points,
          operation,
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
        queryClient.invalidateQueries({ queryKey: ["/customers"] });
        queryClient.invalidateQueries({
          queryKey: [`/customers/${customer.customerId}`],
        });
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

  async function managePoints(values: z.infer<typeof formSchema>) {
    managePointsMutation.mutate(values);
  }

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
          <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/members/customers/edit/${customer.customerId}`}
            >
              {t("view")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="relative w-full flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  {t("loyaltyPoints")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-xs">
                <DialogHeader className="gap-1">
                  <DialogTitle>{t("loyaltyPoints")}</DialogTitle>
                  <DialogDescription className="gap-1 flex justify-center flex-col items-center text-center">
                    {t("addOrRemovePointsForCustomer")}
                    <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                      {customer.email}
                    </span>
                  </DialogDescription>
                </DialogHeader>

                {/* Loyalty management */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(managePoints)}
                    className="flex flex-col gap-4"
                  >
                    {/* current points */}
                    <div className="flex flex-col my-2 justify-center items-center gap-2">
                      <p className="text-xs text-primary uppercase">
                        {t("availablePoints")}
                      </p>
                      <Badge
                        variant={"outline"}
                        size={"default"}
                        className="text-xl  font-helveticaNeue font-black "
                      >
                        {customer.points}
                      </Badge>
                    </div>
                    <Separator />
                    {/* manage points */}
                    <div className="grid grid-cols-1 gap-3">
                      <FormField
                        control={form.control}
                        name="points"
                        render={({ field }) => (
                          <FormItem className=" w-full">
                            <FormLabel>{t("amount")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("amount")}
                                className=" border-primary"
                                type="text"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              {t("managePointsDescription")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-2 relative">
                        {managePointsMutation.isPending && (
                          <div className="absolute -inset-1 rounded-sm bg-white/50 flex justify-center items-center">
                            <Skeleton className="w-full h-full" />
                          </div>
                        )}

                        <FormField
                          control={form.control}
                          name="operation"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Button
                                  disabled={managePointsMutation.isPending}
                                  onClick={() => field.onChange("-")}
                                  type="submit"
                                  variant={"secondary"}
                                  size={"sm"}
                                  className="w-full"
                                >
                                  <MinusCircle />
                                </Button>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="operation"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Button
                                  disabled={managePointsMutation.isPending}
                                  onClick={() => field.onChange("+")}
                                  type="submit"
                                  variant={"default"}
                                  size={"sm"}
                                  className="w-full"
                                >
                                  <PlusCircle />
                                </Button>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </Form>

                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button className="" type="button" variant="ghost">
                      {t("close")}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                {t("unsuspend")}
              </Button>
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="text-destructive w-full rounded-sm bg-destructive/0 hover:text-destructive hover:bg-destructive/10  border-transparent hover:border-transparent"
                    variant="outline"
                  >
                    {t("suspend")}
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
                        {t("close")}
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
                        {t("suspend")}
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
