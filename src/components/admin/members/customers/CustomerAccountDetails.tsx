"use client";

import React, { FC } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { TCustomer, TLevel } from "@/lib/types";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { apiReqQuery } from "@/lib/apiHelpers";
import { Skeleton } from "@/components/ui/skeleton";
import { isRtlLang } from "rtl-detect";

type TCustomerAccountDetails = {
  customer: TCustomer;
};

export const CustomerAccountDetails: FC<TCustomerAccountDetails> = ({
  customer,
}) => {
  const locale = useLocale();
  const t = useTranslations("Customer");

  const { data: levels, isFetching: isFetchingLevels } = useQuery<TLevel[]>({
    queryKey: ["/levels"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/levels", locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
  });

  const formSchema = z.object({
    points: z.string().min(1, t("pointsAreRequired")),
    level: z.string().min(1, t("levelIsRequired")),
    daysTravelled: z.string().min(1, t("daysTravelledAreRequired")),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      points: customer.points.toString(),
      level: customer.level.id.toString(),
      daysTravelled: customer.daysTravelled.toString(),
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch(`/api/customer/update-customer`, {
        method: "PUT",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer.customerId,
          dataToSend: {
            points: Number(values.points),
            level_id: Number(values.level),
            daysTravelled: Number(values.daysTravelled),
          },
        }),
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({
          queryKey: [`/customers/${customer.customerId}`],
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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
      >
        <div className=" flex flex-col gap-6">
          <FormField
            control={form.control}
            name="points"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("availablePoints")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("availablePoints")}
                    className=" border-primary"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="daysTravelled"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("daysTravelled")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("daysTravelled")}
                    className=" border-primary"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isFetchingLevels && <Skeleton className="w-full h-20" />}

          {levels && !isFetchingLevels && (
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className=" w-full mb-2">
                  <FormLabel>{t("level")}</FormLabel>
                  <Select
                    dir={isRtlLang(locale) ? "rtl" : "ltr"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-full border-primary">
                        <SelectValue placeholder={t("selectLevel")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {levels.map((level, i) => (
                        <SelectItem key={i} value={level.id.toString()}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div className="w-full flex justify-center sm:justify-end">
            <Button
              className="w-full max-w-[268px] mt-5"
              variant={"secondary"}
              type="submit"
            >
              {mutation.isPending && (
                <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
              )}
              {t("update")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
