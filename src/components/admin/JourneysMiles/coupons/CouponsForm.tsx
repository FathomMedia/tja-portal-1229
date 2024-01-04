"use client";

import React, { FC, useState } from "react";
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
import { TCoupon } from "@/lib/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

type TCouponsForm = {
  coupon?: TCoupon;
};

export const CouponsForm: FC<TCouponsForm> = ({ coupon }) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const [type, setType] = useState<"percentage" | "fixed" | null>(
    coupon && (coupon.type === "fixed" || coupon.type === "percentage")
      ? coupon.type
      : null
  );

  const formSchema = z
    .object({
      code: z.string().min(1, "Code is required"),
      type: z.enum(["percentage", "fixed"]),
      value: z.number().min(0).optional(),
      percentOff: z.number().min(0).max(100).optional(),
      applyTo: z.enum(["adventure", "consultation"]),
      minPoints: z.number().min(0).optional(),
      maxPoints: z.number().min(0).optional(),
    })
    .superRefine(({ minPoints, maxPoints }, ctx) => {
      if ((maxPoints ?? 0) <= (minPoints ?? 0)) {
        ctx.addIssue({
          code: "custom",
          message: t("maxPointsLow"),
          path: ["maxPoints"],
        });
      }
    });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: coupon?.code ?? "",
      type: coupon?.type ?? undefined,
      value: coupon?.value ?? undefined,
      percentOff: coupon?.percentOff ?? undefined,
      applyTo:
        (coupon && coupon?.applyTo === "adventure") ||
        coupon?.applyTo === "consultation"
          ? coupon.applyTo
          : undefined,
      minPoints: coupon?.minPoints ?? undefined,
      maxPoints: coupon?.maxPoints ?? undefined,
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      return coupon
        ? fetch(`/api/coupon/update-coupon`, {
            method: "POST",
            headers: {
              "Accept-Language": locale,
            },
            body: JSON.stringify({ code: coupon.code, dataToRequest: values }),
          })
        : fetch(`/api/coupon/new-coupon`, {
            method: "POST",
            headers: {
              "Accept-Language": locale,
            },
            body: JSON.stringify({ dataToRequest: values }),
          });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/coupons"] });
        coupon &&
          queryClient.invalidateQueries({
            queryKey: [`/coupons/${coupon.code}`],
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

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("🚀 ~ file: CouponsForm.tsx:124 ~ onSubmit ~ values:", values);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 items-end"
      >
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("code")}</FormLabel>
              <FormControl>
                <Input
                  dir="ltr"
                  placeholder={t("code")}
                  className=" border-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="applyTo"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("applyTo")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-full border-primary">
                    <SelectValue placeholder={t("selectApplyTo")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="adventure">{t("adventure")}</SelectItem>
                  <SelectItem value="consultation">
                    {t("consultation")}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("type")}</FormLabel>
              <Select
                onValueChange={(value) => {
                  (value === "fixed" || value === "percentage") &&
                    setType(value);
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-full border-primary">
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fixed">{t("fixed")}</SelectItem>
                  <SelectItem value="percentage">{t("percentage")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === "fixed" && (
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("value")}</FormLabel>
                <FormControl>
                  <Input
                    dir="ltr"
                    placeholder={t("value")}
                    className=" border-primary"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {type === "percentage" && (
          <FormField
            control={form.control}
            name="percentOff"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("percentage")}</FormLabel>
                <FormControl>
                  <Input
                    dir="ltr"
                    placeholder={t("percentage")}
                    className=" border-primary"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="minPoints"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("minPoints")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("minPoints")}
                  className=" border-primary"
                  {...field}
                  type="number"
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="maxPoints"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("maxPoints")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("maxPoints")}
                  className=" border-primary"
                  {...field}
                  type="number"
                  onChange={(event) =>
                    field.onChange(Number(event.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-center sm:justify-start">
          <Button
            className="w-full max-w-[268px] mt-5"
            variant={"secondary"}
            type="submit"
          >
            {mutation.isPending && (
              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
            )}
            {coupon ? t("update") : t("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
