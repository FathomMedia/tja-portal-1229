"use client";

import { TAddon, TAdventure, TCoupon, TUser } from "@/lib/types";
import React, { FC, useState } from "react";
// import { AdventureChoices } from "./AdventureChoices";
import { string, z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Badge } from "../ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";
import { AddonsSelect } from "./AddonsSelect";
import { Button, buttonVariants } from "../ui/button";
import { Icons } from "../ui/icons";
import { CouponsSelect } from "./CouponsSelect";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PaymentTypeSelect } from "./PaymentTypeSelect";

type TAdventureCheckoutForm = {
  adventure: TAdventure;
  user: TUser;
  myCoupons: TCoupon[] | null;
};

export const AdventureCheckoutForm: FC<TAdventureCheckoutForm> = ({
  adventure,
  user,
  myCoupons,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("Checkout");

  const formSchema = z.object({
    why: z.string().min(1, t("why.errors.required")),
    addOns: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        price: z.number(),
      })
    ),
    coupon: z
      .object({
        id: z.number(),
        code: z.string(),
        type: z.enum(["percentage", "fixed"]),
        value: z.number().optional(),
        percentOff: z.number().optional(),
        minPoints: z.number(),
        maxPoints: z.number(),
        applyTo: z.string(),
        isUsed: z.number(),
      })
      .optional(),
    isPartialPayment: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      why: "",
      addOns: [],
      isPartialPayment: adventure.isPartialAllowed ? true : false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("values", values);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  type TAdventureChoices = {
    adventure: TAdventure;
    myCoupons: TCoupon[] | null;
    form: typeof form;
  };

  const AdventureChoices: FC<TAdventureChoices> = ({
    adventure,
    form,
    myCoupons,
  }) => {
    const t = useTranslations("Adventures");
    const locale = useLocale();

    return (
      <div className="flex flex-col gap-4 @container">
        {/* Adventure */}
        <div className="flex flex-col @xl:flex-row items-start gap-6">
          <div className="relative aspect-[13/5] @xl:aspect-square w-full @xl:w-1/4 rounded-lg overflow-clip">
            <Image
              src={"/assets/images/adventure.jpg"}
              className="object-cover w-full h-full bg-muted/25"
              width={300}
              height={100}
              alt="Adventure"
            />
          </div>
          {/* Adventure info */}
          <div className="w-full flex flex-col justify-between space-y-2">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold md:text-2xl text-xl">
                {adventure.title}
              </h3>
              <div className="flex justify-between item-center">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={"secondary"}>
                    {t("startDate")} <p>{adventure.startDate}</p>
                  </Badge>
                  <Badge variant={"secondary"}>
                    {t("endDate")} <p>{adventure.endDate}</p>
                  </Badge>
                  <Badge variant={"info"}>
                    <p>{adventure.gender}</p>
                  </Badge>
                </div>
              </div>
              <p className="md:text-lg text-muted text-base">
                {adventure.description}
              </p>
            </div>
            <p className="text-muted mb-4">
              <span className="font-bold">{t("country")}</span>{" "}
              {adventure.country}
            </p>

            <p className="text-muted mb-4">
              <span className="font-bold">{t("continent")}:</span>{" "}
              {adventure.continent}
            </p>
            <p className="text-muted mb-4">
              <span className="font-bold">{t("price")}:</span>{" "}
              {adventure.priceWithCurrency}
            </p>
          </div>
        </div>
        <Separator className="bg-muted/50" />
        {/* Why did you choose this destination */}
        <FormField
          control={form.control}
          name="why"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>
                {"Why you choose this distention?"}
                <span className="text-destructive ms-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why you choose this distention?..."
                  className=" border-primary-foreground bg-muted/20 text-primary-foreground placeholder:text-primary-foreground/50 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {adventure.addOns.length > 0 && <Separator className="bg-muted/50" />}
        {adventure.addOns.length > 0 && (
          <FormField
            control={form.control}
            name="addOns"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{"Addons"}</FormLabel>
                <FormControl>
                  <AddonsSelect
                    addons={adventure.addOns}
                    defaultSelected={field.value}
                    onSelect={(selected) => {
                      console.log("AddonsSelected", selected);
                      field.onChange(selected);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Separator className="bg-muted/50" />
        <FormField
          control={form.control}
          name="coupon"
          render={({ field }) => (
            <FormItem className=" w-full">
              <div className="flex items-center justify-between flex-wrap">
                <FormLabel>{"Coupons"}</FormLabel>
                <Link
                  className={cn(
                    buttonVariants({ variant: "link" }),
                    "text-sm text-primary-foreground"
                  )}
                  href={`/${locale}/dashboard/journeys-miles`}
                >
                  Get Coupons
                </Link>
              </div>
              {myCoupons && myCoupons.length > 0 && (
                <FormControl>
                  <CouponsSelect
                    coupons={myCoupons}
                    defaultSelected={field.value}
                    onSelect={(selected) => {
                      console.log("CouponSelected", selected);
                      field.onChange(selected);
                    }}
                  />
                </FormControl>
              )}
              {/* if user have no redeemed coupons  */}
              {!myCoupons ||
                (myCoupons.length === 0 && (
                  <div className="p-4 rounded-md select-none min-w-[15rem] flex justify-center text-center items-center cursor-pointer min-h-[5rem]  gap-3 text-primary-foreground border-2 border-border/60 border-dashed ">
                    <p className="text-sm font-medium">
                      {"You don't have any redeemed coupons"}
                    </p>
                  </div>
                ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator className="bg-muted/50" />
        <FormField
          control={form.control}
          name="isPartialPayment"
          render={({ field }) => (
            <FormItem className=" w-full">
              <div className="flex items-center justify-between flex-wrap">
                <FormLabel>{"Payment type"}</FormLabel>
              </div>
              <FormControl>
                <PaymentTypeSelect
                  defaultSelected={field.value}
                  onSelect={(selected) => {
                    console.log("isPartialSelected", selected);
                    field.onChange(selected);
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Billing Info */}
          <div className="order-2 lg:order-1 bg-background text-foreground p-4">
            <div>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
              <p>Billing</p>
            </div>
            <div className="flex flex-col gap-4">
              <Button type="submit" className="w-fit">
                {isLoading && (
                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                )}
                Place Order
              </Button>
            </div>
          </div>
          {/* Checkout choices */}
          <div className="order-1 lg:order-2 bg-primary rounded-xl text-primary-foreground p-4">
            <AdventureChoices
              form={form}
              adventure={adventure}
              myCoupons={myCoupons}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
