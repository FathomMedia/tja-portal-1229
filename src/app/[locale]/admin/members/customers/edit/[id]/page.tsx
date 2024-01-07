"use client";
import { Separator } from "@/components/ui/separator";
import { TCoupon, TCustomer } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomerAccountDetails } from "@/components/admin/members/customers/CustomerAccountDetails";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DisplayTranslatedText } from "@/components/Helper";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
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
import { ClipboardCopy } from "lucide-react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Customer");
  const queryClient = useQueryClient();

  const { data: customer, isFetching: isFetchingCustomer } =
    useQuery<TCustomer>({
      queryKey: [`/customers/${id}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/customers/${id}`, locale }).then((res) =>
          res.json().then((resData) => resData.data)
        ),
    });

  const { data: myCoupons, isFetching: isFetchingMyCoupons } = useQuery<
    TCoupon[]
  >({
    queryKey: [`/customers/${id}/coupons`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/customers/${id}/coupons`, locale }).then(
        (res) => res.json().then((resData) => resData.data)
      ),
  });

  const suspendMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/user/handleSuspend`, {
        method: "POST",
        body: JSON.stringify({
          customerId: id,
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
        queryClient.invalidateQueries({
          queryKey: [`/customers/${id}`],
        });
        queryClient.invalidateQueries({ queryKey: [`/customers`] });
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  const formSchema = z.object({
    reason: z.string().min(1, t("reasonIsRequired")),
    code: z.string(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: "",
      code: "",
    },
  });

  const revokeCouponMutation = useMutation({
    mutationFn: ({ code, reason }: { code: string; reason: string }) => {
      return fetch(`/api/user/revokeCoupon`, {
        method: "POST",
        body: JSON.stringify({
          customerId: Number(id),
          code,
          reason,
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
        queryClient.invalidateQueries({
          queryKey: [`/customers/${id}/coupons`],
        });
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  async function revokeCoupon(values: z.infer<typeof formSchema>) {
    revokeCouponMutation.mutate(values);
  }

  return (
    <div className="max-w-4xl flex flex-col gap-10 pb-20 @container">
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          {t("customer")}
        </h2>
      </div>
      {isFetchingCustomer && <Skeleton className="w-full h-64" />}
      {customer && !isFetchingCustomer && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <CopyValue title={t("name")} value={customer.name} />
          <CopyValue title={t("email")} value={customer.email} />
          <CopyValue title={t("phone")} value={customer.phone} />
          <CopyValue
            title={t("gender")}
            value={customer.gender === "M" ? t("male") : t("female")}
          />
          <CopyValue title={t("dob")} value={customer.dateOfBirth} />
          <CopyValue title={t("joinedAt")} value={customer.joinedAt} />
          <CopyValue
            title={t("availablePoints")}
            value={customer.points.toString()}
          />
          <CopyValue
            title={t("totalPoints")}
            value={customer.totalPoints.toString()}
          />
          <CopyValue
            title={t("daysTravelled")}
            value={customer.daysTravelled.toString()}
          />
          <CopyValue title={t("level")} value={customer.level.name} />
        </div>
      )}
      <Separator />
      <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
        {t("journeyMiles")}
      </h2>
      {isFetchingCustomer && <Skeleton className="w-full h-64" />}
      {customer && !isFetchingCustomer && (
        <CustomerAccountDetails customer={customer} />
      )}
      <Separator />
      <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
        {t("redeemedCoupons")}
      </h2>
      <div className="grid gap-3 @container grid-cols-1 @md:grid-cols-2">
        {isFetchingMyCoupons && <Skeleton className="w-full h-28" />}
        {!isFetchingMyCoupons && myCoupons && myCoupons.length === 0 && (
          <div className="p-4 bg-muted text-muted-foreground text-sm rounded-md h-28 flex flex-col justify-center items-center">
            <p>{t("nothingFound")}</p>
          </div>
        )}
        {!isFetchingMyCoupons &&
          myCoupons &&
          myCoupons.map((coupon, i) => (
            <div
              key={i}
              className={cn(
                "p-4 rounded-md w-full min-h-[5rem] bg-background gap-3 text-foreground  flex justify-between border-2 border-border"
              )}
            >
              <div className="flex flex-col gap-3 justify-between w-full">
                <div className="w-full">
                  <p className="text-sm font-medium break-all">{coupon.code}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {coupon.applyTo}
                  </p>
                </div>
                <p className="text-sm font-bold text-secondary">
                  {coupon.type === "percentage"
                    ? `${coupon.percentOff}% off`
                    : formatePrice({ locale, price: coupon.value! })}
                </p>
              </div>
              <div className="flex flex-col justify-end">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="link"
                      size={"sm"}
                      className="text-destructive"
                    >
                      {t("revoke")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(revokeCoupon)}
                        className="grid grid-cols-1  gap-4 items-end"
                      >
                        <DialogHeader className="gap-1">
                          <DialogTitle>{t("revokeCoupon")}</DialogTitle>
                          <DialogDescription className="gap-1 flex flex-wrap">
                            {t("areYouSureYouWantToRevoke")}
                            <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                              {coupon.code}
                            </span>
                            {t("forCustomer")}
                            <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                              {customer?.email}
                            </span>
                          </DialogDescription>
                        </DialogHeader>
                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem className=" w-full">
                              <FormLabel>{t("reason")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("reason")}
                                  className=" border-primary"
                                  type="text"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                {t("revokeDescription")}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <DialogFooter className="sm:justify-start">
                          <DialogClose asChild>
                            <Button className="" type="button" variant="ghost">
                              {t("close")}
                            </Button>
                          </DialogClose>

                          <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem className=" w-full">
                                <FormControl>
                                  <Button
                                    disabled={revokeCouponMutation.isPending}
                                    onClick={() => field.onChange(coupon.code)}
                                    type="submit"
                                    variant={"destructive"}
                                  >
                                    {revokeCouponMutation.isPending && (
                                      <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t("revoke")}
                                  </Button>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
      </div>
      <Separator />
      <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
        {t("status")}
      </h2>
      <div>
        {isFetchingCustomer && <Skeleton className="w-full h-20" />}
        {customer && !isFetchingCustomer && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col grow items-start border border-muted rounded-md p-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <p>{t("status")}</p>
                  <Badge
                    variant={customer.isSuspended ? "destructive" : "info"}
                  >
                    <DisplayTranslatedText
                      text={customer.status}
                      translation="Dashboard"
                    />
                  </Badge>
                </div>
                {customer.isSuspended ? (
                  <Button
                    disabled={suspendMutation.isPending}
                    onClick={() => suspendMutation.mutate()}
                    type="button"
                    className=""
                    variant="info"
                  >
                    {suspendMutation.isPending && (
                      <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                    )}
                    {t("unsuspend")}
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive">{t("suspend")}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                      <DialogHeader className="gap-1">
                        <DialogTitle>{t("suspendCustomer")}</DialogTitle>
                        <DialogDescription className="gap-1 flex flex-wrap">
                          {t("areYouSureYouWantToSuspend")}
                          <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                            {customer.email}
                          </span>
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
                            disabled={suspendMutation.isPending}
                            onClick={() => suspendMutation.mutate()}
                            type="button"
                            variant={"destructive"}
                          >
                            {suspendMutation.isPending && (
                              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                            )}
                            {t("suspend")}
                          </Button>
                        </>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { cn, formatePrice } from "@/lib/utils";
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

const CopyValue = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium text-sm">{title}</p>
      <Button
        variant={"outline"}
        size={"sm"}
        className="flex items-center justify-start gap-1 text-xs w-full hover:cursor-copy group"
        onClick={() => {
          toast.message(`${title} copied to your clipboard.`, {
            icon: <ClipboardCopy className="w-3 h-3" />,
          });
          navigator.clipboard.writeText(value);
        }}
      >
        {value}
        <span>
          <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
        </span>
      </Button>
    </div>
  );
};
