"use client";

import { TConsultation, TCoupon, TUser } from "@/lib/types";
import React, { FC, useEffect, useState } from "react";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { CouponsSelect } from "./CouponsSelect";
import Link from "next/link";
import { cn, formatePrice } from "@/lib/utils";
import { PaymentTypeSelect } from "./PaymentTypeSelect";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

type TConsultationCheckoutForm = {
  consultation: TConsultation;
  user: TUser;
  myCoupons: TCoupon[] | null;
};

export const AdventureCheckoutForm: FC<TConsultationCheckoutForm> = ({
  consultation,
  user,
  myCoupons,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { push } = useRouter();

  const formSchema = z
    .object({
      // Consultation choices
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
        .nullable(),
      // Payment method
      paymentMethod: z.enum(["benefitpay", "applepay", "card"]),
      cardName: z.string().optional(),
      cardNumber: z.string().optional(),
      cardExpMonth: z.string().optional(),
      cardExpYear: z.string().optional(),
      cardCVV: z.string().optional(),
    })
    .superRefine(
      (
        {
          paymentMethod,
          cardName,
          cardNumber,
          cardExpMonth,
          cardExpYear,
          cardCVV,
        },
        ctx
      ) => {
        if (paymentMethod === "card" && cardName === undefined) {
          ctx.addIssue({
            code: "custom",
            message: "Card name is required",
            path: ["cardName"],
          });
        }
        if (paymentMethod === "card" && cardNumber === undefined) {
          ctx.addIssue({
            code: "custom",
            message: "Card number is required",
            path: ["cardNumber"],
          });
        }
        if (paymentMethod === "card" && cardExpMonth === undefined) {
          ctx.addIssue({
            code: "custom",
            message: "Card expiry month is required",
            path: ["cardExpMonth"],
          });
        }
        if (paymentMethod === "card" && cardExpYear === undefined) {
          ctx.addIssue({
            code: "custom",
            message: "Card expiry year is required",
            path: ["cardExpYear"],
          });
        }
        if (paymentMethod === "card" && cardCVV === undefined) {
          ctx.addIssue({
            code: "custom",
            message: "Card CVV is required",
            path: ["cardCVV"],
          });
        }
        if (
          paymentMethod === "card" &&
          ((cardCVV ?? []).length < 3 || (cardCVV ?? []).length > 3)
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Card CVV is invalid",
            path: ["cardCVV"],
          });
        }
        if (
          paymentMethod === "card" &&
          ((cardNumber ?? []).length < 16 || (cardNumber ?? []).length > 16)
        ) {
          ctx.addIssue({
            code: "custom",
            message: "Card number is invalid",
            path: ["cardCVV"],
          });
        }
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      coupon: null,
      paymentMethod: "card",
      cardName: "",
      cardNumber: "",
      cardExpMonth: "",
      cardExpYear: "",
      cardCVV: "",
    },
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(form.formState.defaultValues?.paymentMethod);

  const [discount, setDiscount] = useState(0);
  const [totalFullPrice, setTotalFullPrice] = useState(0);

  useEffect(() => {
    return () => {};
  }, [consultation.price, discount, totalFullPrice]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    var dataToRequest = {
      payment_method: values.paymentMethod,
      ...(values.coupon && { coupon: values.coupon.code }),
      ...(values.paymentMethod === "card" && {
        card_holder_name: values.cardName,
        card_number: values.cardNumber,
        card_expiry_month: values.cardExpMonth,
        card_expiry_year: values.cardExpYear,
        card_cvv: values.cardCVV,
      }),
    };

    const response = await fetch(`/api/book/consultation`, {
      method: "POST",
      body: JSON.stringify({
        id: consultation.id,
        dataToRequest: dataToRequest,
      }),
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
    })
      .then(async (paymentSessionRes) => {
        if (paymentSessionRes.ok) {
          const paymentSession = await paymentSessionRes.json();

          push(paymentSession.session.PaymentURL);
        } else {
          toast.error("Failed to create a payment session.");
        }
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: consultationCheckoutForm.tsx:265 ~ .then ~ err:",
          err
        );
        toast.error(err.message);
      })

      .finally(() => setIsLoading(false));

    console.log(response);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 lg:grid-cols-2 place-items-center lg:place-items-start">
          {/* ----------------Billing Details---------------- */}
          <div className="order-2 lg:order-1 bg-background w-full text-foreground p-4 max-w-3xl">
            <div className="flex flex-col gap-4 @container">
              {/* Payment Breakdown */}
              <div className="flex flex-col mb-6 gap-3">
                <h3 className="font-bold md:text-2xl text-xl text-primary">
                  {t("paymentBreakdown")}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <p className="font-medium">{t("consultation")}:</p>
                  <p>{formatePrice({ locale, price: consultation.price })}</p>

                  <p className="font-medium">{t("discount")}:</p>
                  <p>{formatePrice({ locale, price: discount })} -</p>
                </div>
              </div>
              <Separator className="bg-muted/50" />
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>{t("paymentMethod")}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className=" w-full">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => {
                              setSelectedPaymentMethod(val);
                              field.onChange(val);
                            }}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-4"
                          >
                            <div>
                              <RadioGroupItem
                                value="card"
                                id="card"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="card"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <Icons.card className="h-6 w-6" />
                                {t("creditCard")}
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="benefitpay"
                                id="benefitpay"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="benefitpay"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="mb-3">
                                  <Icons.benefitPay className="h-6 w-6" />
                                </div>
                                {t("benefitPay")}
                              </Label>
                            </div>
                            <div>
                              <RadioGroupItem
                                value="applepay"
                                id="applepay"
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor="applepay"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <Icons.apple className="mb-3 h-6 w-6" />
                                {t("applePay")}
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* card details */}
                  {selectedPaymentMethod === "card" && (
                    <div className={cn("grid gap-6")}>
                      <FormField
                        control={form.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem className="grid gap-2 w-full">
                            <FormLabel>
                              {"Name"}
                              <span className="text-destructive ms-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Name on card"
                                className=" "
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem className="grid gap-2 w-full">
                            <FormLabel>
                              {"Card Number"}
                              <span className="text-destructive ms-1">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="" className=" " {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="cardExpMonth"
                          render={({ field }) => (
                            <FormItem className="grid gap-2 w-full">
                              <FormLabel>
                                {"Expires"}
                                <span className="text-destructive ms-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger
                                    className="rounded-full"
                                    id="month"
                                  >
                                    <SelectValue placeholder="Month" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1">
                                      {t("january")}
                                    </SelectItem>
                                    ,
                                    <SelectItem value="2">
                                      {t("february")}
                                    </SelectItem>
                                    <SelectItem value="3">
                                      {t("March")}
                                    </SelectItem>
                                    <SelectItem value="4">
                                      {t("april")}
                                    </SelectItem>
                                    <SelectItem value="5">
                                      {t("may")}
                                    </SelectItem>
                                    <SelectItem value="6">June</SelectItem>
                                    <SelectItem value="7">July</SelectItem>
                                    <SelectItem value="8">August</SelectItem>
                                    <SelectItem value="9">September</SelectItem>
                                    <SelectItem value="10">October</SelectItem>
                                    <SelectItem value="11">November</SelectItem>
                                    <SelectItem value="12">December</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardExpYear"
                          render={({ field }) => (
                            <FormItem className="grid gap-2 w-full">
                              <FormLabel>
                                {"Year"}
                                <span className="text-destructive ms-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Select
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger
                                    className="rounded-full"
                                    id="year"
                                  >
                                    <SelectValue placeholder="Year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Array.from({ length: 10 }, (_, i) => (
                                      <SelectItem
                                        key={i}
                                        value={`${
                                          new Date().getFullYear() + i
                                        }`}
                                      >
                                        {new Date().getFullYear() + i}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardCVV"
                          render={({ field }) => (
                            <FormItem className="grid gap-2 w-full">
                              <FormLabel>
                                {"CVV"}
                                <span className="text-destructive ms-1">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="CVV"
                                  className=" "
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    // disabled={!form.formState.isValid}
                    className="w-full mt-4"
                  >
                    {isLoading && (
                      <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                    )}
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          {/* ----------------Billing Details---------------- */}
          {/* Checkout choices */}
          <div className="order-1 lg:order-2 bg-primary rounded-xl w-full text-primary-foreground max-w-3xl p-4 md:p-6">
            {/* ----------------consultation Choices---------------- */}
            <div className="flex flex-col gap-4 @container">
              {/* consultation */}
              <div className="flex flex-col @xl:flex-row items-start gap-6">
                <div className="relative aspect-[13/5] @xl:aspect-square w-full @xl:w-1/4 rounded-lg overflow-clip">
                  <Image
                    priority
                    src={"/assets/images/consultation.jpg"}
                    className="object-cover w-full h-full bg-muted/25"
                    width={300}
                    height={100}
                    alt="consultation"
                  />
                </div>
                {/* consultation info */}
                <div className="w-full flex flex-col justify-between space-y-2">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold md:text-2xl text-xl">
                      {consultation.tier}
                    </h3>
                    {/* <div className="flex justify-between item-center">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={"secondary"}>
                          {t("startDate")} <p>{consultation.startDate}</p>
                        </Badge>
                        <Badge variant={"secondary"}>
                          {t("endDate")} <p>{consultation.endDate}</p>
                        </Badge>
                      </div>
                    </div> */}
                  </div>

                  {/* <p className="text-muted mb-4">
                    <span className="font-bold">{t("price")}:</span>{" "}
                    {consultation.priceWithCurrency}
                  </p> */}
                </div>
              </div>
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
                          applyTo="consultation"
                          coupons={myCoupons}
                          defaultSelected={field.value}
                          onSelect={(selected) => {
                            setDiscount(selected?.value || 0);

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
            </div>
            {/* ----------------Consultation Choices---------------- */}
          </div>
        </div>
      </form>
    </Form>
  );
};
