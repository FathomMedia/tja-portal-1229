"use client";

import { TAddon, TAdventure, TCoupon, TUser } from "@/lib/types";
import React, { FC, useEffect, useState } from "react";
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
    // Adventures choices
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
    // Billing Info
    customerName: z.string().min(1),
    address: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
    email: z.string().email().min(1),
    phone: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      why: "",
      addOns: [],
      isPartialPayment: adventure.isPartialAllowed ? true : false,
      customerName: user.name,
      email: user.email,
      phone: user.phone,
      address: "",
      city: "",
      country: "",
    },
  });

  const [addonsTotal, setAddonsTotal] = useState(0);
  const [totalAdventureWithAddons, setTotalAdventureWithAddons] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalFullPrice, setTotalFullPrice] = useState(0);
  const [partialPrice, setPartialPrice] = useState(0);
  const [partialRemaining, setPartialRemaining] = useState(0);

  useEffect(() => {
    setTotalAdventureWithAddons(adventure.price + addonsTotal);

    setTotalFullPrice(totalAdventureWithAddons - discount);

    setPartialPrice(totalFullPrice * 0.3);

    setPartialRemaining(totalFullPrice * 0.7);

    return () => {};
  }, [
    addonsTotal,
    adventure.price,
    discount,
    totalAdventureWithAddons,
    totalFullPrice,
  ]);

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
    payment: {
      setAddonsTotal: typeof setAddonsTotal;
      setDiscount: typeof setDiscount;
      totalFullPrice: number;
      partialPrice: number;
      partialRemaining: number;
    };
  };

  const AdventureChoices: FC<TAdventureChoices> = ({
    adventure,
    form,
    myCoupons,
    payment,
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
                      payment.setAddonsTotal(
                        selected.reduce((sum, addon) => sum + addon.price, 0)
                      );
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
                    "text-sm text-secondary"
                  )}
                  href={`/${locale}/dashboard/journeys-miles`}
                >
                  Get Coupons
                </Link>
              </div>
              {myCoupons && myCoupons.length > 0 && (
                <FormControl>
                  <CouponsSelect
                    applyTo="adventure"
                    coupons={myCoupons}
                    defaultSelected={field.value}
                    onSelect={(selected) => {
                      if (selected?.type === "percentage") {
                        payment.setDiscount(
                          (totalAdventureWithAddons *
                            (selected.percentOff || 0)) /
                            100
                        );
                      } else {
                        payment.setDiscount(selected?.value || 0);
                      }

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
                  fullPrice={Intl.NumberFormat(locale, {
                    currency: "BHD",
                    style: "currency",
                  }).format(payment.totalFullPrice)}
                  partialPrice={Intl.NumberFormat(locale, {
                    currency: "BHD",
                    style: "currency",
                  }).format(payment.partialPrice)}
                  partialRemaining={Intl.NumberFormat(locale, {
                    currency: "BHD",
                    style: "currency",
                  }).format(payment.partialRemaining)}
                  defaultSelected={field.value}
                  onSelect={(selected) => {
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

  type TBillingInfo = {
    form: typeof form;
  };

  const BillingInfo: FC<TBillingInfo> = ({ form }) => {
    const t = useTranslations("Adventures");
    const locale = useLocale();

    return (
      <div className="flex flex-col gap-4 @container">
        <h3 className="font-bold md:text-2xl text-primary text-xl">
          Billing Details
        </h3>
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {"Name"}
                <span className="text-destructive ms-1">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Full Name" className=" " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="@container flex-col @md:flex-row gap-3 flex">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>
                  {"Email"}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Email" className=" " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>
                  {"Phone"}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Phone" className=" " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>
                {"Address"}
                <span className="text-destructive ms-1">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Address" className=" " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="@container flex-col @md:flex-row gap-3 flex">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>
                  {"Town/City"}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Town/City" className=" " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>
                  {"Country"}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Country" className=" " {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator className="bg-muted/50" />
        {/* Payment summary */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold md:text-2xl text-xl">Total</h3>
          <p>{`${adventure.price} BHD`}</p>
          <p>{`Partial Payment: ${adventure.partialPrice} BHD`}</p>

          <p>{`Addons Total: ${addonsTotal} BHD`}</p>
          <p>{`Discount: ${discount} BHD`}</p>
          {/* <p>{`Total: ${total} BHD (with ${discount} BHD discount)`}</p> */}
        </div>
        <Button
          type="submit"
          disabled={!form.formState.isValid}
          className="w-fit"
        >
          {isLoading && <Icons.spinner className="me-2 h-4 w-4 animate-spin" />}
          Place Order
        </Button>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center lg:place-items-start">
          {/* Billing Info */}
          <div className="order-2 lg:order-1 bg-background w-full text-foreground p-4 max-w-3xl">
            <BillingInfo form={form} />
          </div>
          {/* Checkout choices */}
          <div className="order-1 lg:order-2 bg-primary rounded-xl w-full text-primary-foreground max-w-3xl p-4 md:p-6">
            <AdventureChoices
              form={form}
              adventure={adventure}
              myCoupons={myCoupons}
              payment={{
                totalFullPrice: totalAdventureWithAddons,
                partialPrice: partialPrice,
                partialRemaining: partialRemaining,
                setAddonsTotal: setAddonsTotal,
                setDiscount: setDiscount,
              }}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
