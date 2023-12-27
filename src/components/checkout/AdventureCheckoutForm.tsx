"use client";

import { TAdventure, TCoupon } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import { AddonsSelect } from "./AddonsSelect";
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
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiReqQuery } from "@/lib/apiHelpers";
import { Skeleton } from "../ui/skeleton";

type TAdventureCheckoutForm = {
  initAdventure: TAdventure;
};

export const AdventureCheckoutForm: FC<TAdventureCheckoutForm> = ({
  initAdventure,
}) => {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { push } = useRouter();

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      var dataToRequest = {
        reason: values.why,
        is_partial: values.isPartialPayment,
        payment_method: values.paymentMethod,
        ...(values.coupon && { coupon: values.coupon.code }),

        ...(values.addOns.length > 0 && {
          add_ons: values.addOns.map((addon) => addon.id),
        }),
        // ...(values.paymentMethod === "card" && {
        //   card_holder_name: values.cardName,
        //   card_number: values.cardNumber,
        //   card_expiry_month: values.cardExpMonth,
        //   card_expiry_year: values.cardExpYear,
        //   card_cvv: values.cardCVV,
        // }),
      };
      console.log(
        "🚀 ~ file: AdventureCheckoutForm.tsx:81 ~ dataToRequest:",
        dataToRequest
      );

      return fetch(`/api/book/adventure`, {
        method: "POST",
        body: JSON.stringify({
          slug: adventure.slug,
          dataToRequest: dataToRequest,
        }),
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const paymentSession = await data.json();

        if (paymentSession?.session?.PaymentURL) {
          push(paymentSession?.session?.PaymentURL);
        } else {
          toast.error("Couldn't create a payment session", { duration: 6000 });
        }
      } else {
        toast.error("Couldn't create a payment session", { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  const { data: adventure, isFetching: isFetchingAdventure } =
    useQuery<TAdventure>({
      queryKey: [`/adventures/${initAdventure.slug}`],
      queryFn: () =>
        apiReqQuery({
          endpoint: `/adventures/${initAdventure.slug}`,
          locale,
        }).then((res) => res.json().then((resData) => resData.data)),
      initialData: initAdventure,
    });

  const { data: myCoupons, isFetching: isFetchingMyCoupons } = useQuery<
    TCoupon[]
  >({
    queryKey: ["/profile/coupons/redeemed"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/profile/coupons/redeemed", locale }).then(
        (res) => res.json().then((resData) => resData.data)
      ),
  });

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
      .nullable(),
    isPartialPayment: z.boolean(),
    // // Billing Info
    // customerName: z.string().min(1),
    // address: z.string().min(1),
    // city: z.string().min(1),
    // country: z.string().min(1),
    // email: z.string().email().min(1),
    // phone: z.string().min(1),
    // Payment method
    paymentMethod: z.enum(["benefitpay", "applepay", "card"]),
    // cardName: z.string().optional(),
    // cardNumber: z.string().optional(),
    // cardExpMonth: z.string().optional(),
    // cardExpYear: z.string().optional(),
    // cardCVV: z.string().optional(),
  });
  // .superRefine(
  //   (
  //     {
  //       paymentMethod,
  //       cardName,
  //       cardNumber,
  //       cardExpMonth,
  //       cardExpYear,
  //       cardCVV,
  //     },
  //     ctx
  //   ) => {
  //     if (paymentMethod === "card" && cardName === undefined) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "Card name is required",
  //         path: ["cardName"],
  //       });
  //     }
  //     if (paymentMethod === "card" && cardNumber === undefined) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "Card number is required",
  //         path: ["cardNumber"],
  //       });
  //     }
  //     if (paymentMethod === "card" && cardExpMonth === undefined) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "Card expiry month is required",
  //         path: ["cardExpMonth"],
  //       });
  //     }
  //     if (paymentMethod === "card" && cardExpYear === undefined) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "Card expiry year is required",
  //         path: ["cardExpYear"],
  //       });
  //     }
  //     if (paymentMethod === "card" && cardCVV === undefined) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "Card CVV is required",
  //         path: ["cardCVV"],
  //       });
  //     }
  //     if (
  //       paymentMethod === "card" &&
  //       ((cardCVV ?? []).length < 3 || (cardCVV ?? []).length > 3)
  //     ) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "Card CVV is invalid",
  //         path: ["cardCVV"],
  //       });
  //     }
  //     if (
  //       paymentMethod === "card" &&
  //       ((cardNumber ?? []).length < 16 || (cardNumber ?? []).length > 16)
  //     ) {
  //       ctx.addIssue({
  //         code: "custom",
  //         message: "Card number is invalid",
  //         path: ["cardCVV"],
  //       });
  //     }
  //   }
  // );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      why: "",
      addOns: [],
      coupon: null,
      isPartialPayment: adventure?.isPartialAllowed ? true : false,
      // customerName: user.name,
      // email: user.email,
      // phone: user.phone,
      // address: "",
      // city: "",
      // country: "",
      paymentMethod: "card",
      // cardName: "",
      // cardNumber: "",
      // cardExpMonth: "",
      // cardExpYear: "",
      // cardCVV: "",
    },
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(form.formState.defaultValues?.paymentMethod);

  const [addonsTotal, setAddonsTotal] = useState(0);
  const [totalAdventureWithAddons, setTotalAdventureWithAddons] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalFullPrice, setTotalFullPrice] = useState(0);
  const [partialPrice, setPartialPrice] = useState(0);
  const [partialRemaining, setPartialRemaining] = useState(0);

  useEffect(() => {
    setTotalAdventureWithAddons(adventure?.price + addonsTotal);

    setTotalFullPrice(totalAdventureWithAddons - discount);

    setPartialPrice(totalFullPrice * 0.3);

    setPartialRemaining(totalFullPrice * 0.7);

    return () => {};
  }, [
    addonsTotal,
    adventure?.price,
    discount,
    totalAdventureWithAddons,
    totalFullPrice,
  ]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
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
                {isFetchingAdventure && <Skeleton className="w-full h-60" />}
                {adventure && !isFetchingAdventure && (
                  <div className="grid grid-cols-2 gap-3">
                    <p className="font-medium">{t("adventure")}:</p>
                    <p>{formatePrice({ locale, price: adventure.price })}</p>
                    <p className="font-medium">{t("addons")}:</p>
                    <p>{formatePrice({ locale, price: addonsTotal })} +</p>
                    <p className="font-medium">{t("discount")}:</p>
                    <p>{formatePrice({ locale, price: discount })} -</p>
                    {form.getValues().isPartialPayment && (
                      <>
                        <p className="font-medium">{t("remaining")}:</p>
                        <div>
                          <p>
                            {formatePrice({ locale, price: partialRemaining })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t("toBePaidLater")}
                          </p>
                        </div>
                      </>
                    )}
                    {form.getValues().isPartialPayment && (
                      <p className="font-medium">{t("total")}:</p>
                    )}
                    {form.getValues().isPartialPayment && (
                      <p>{formatePrice({ locale, price: totalFullPrice })}</p>
                    )}
                    <Separator className="bg-muted/50 col-span-2" />
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      <p className="text-xl font-medium text-primary">
                        {form.getValues().isPartialPayment
                          ? t("payNow") + ":"
                          : t("total") + ":"}
                      </p>
                      <p className="text-xl font-medium text-primary">
                        {form.getValues().isPartialPayment
                          ? formatePrice({ locale, price: partialPrice })
                          : formatePrice({ locale, price: totalFullPrice })}
                      </p>
                    </div>
                  </div>
                )}
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
                      <FormItem className="@container/paymentMethod w-full">
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => {
                              setSelectedPaymentMethod(val);
                              field.onChange(val);
                            }}
                            defaultValue={field.value}
                            className="grid @sm/paymentMethod:grid-cols-3 grid-cols-1 gap-4"
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
                        {field.value === "benefitpay" && (
                          <p className="text-muted-foreground text-sm">
                            {t("benefitPay-debit-card-for-Bahraini-only")}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* card details */}
                  {/* {selectedPaymentMethod === "card" && (
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
                  )} */}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    // disabled={!form.formState.isValid}
                    className="w-full mt-4"
                  >
                    {mutation.isPending && (
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
            {/* ----------------Adventure Choices---------------- */}
            <div className="flex flex-col gap-4 @container">
              {/* Adventure */}
              <div className="flex flex-col @xl:flex-row items-start gap-6">
                <div className="relative aspect-[13/5] @xl:aspect-square w-full @xl:w-1/4 rounded-lg overflow-clip">
                  <Image
                    priority
                    src={"/assets/images/adventure.jpg"}
                    className="object-cover w-full h-full bg-muted/25"
                    width={300}
                    height={100}
                    alt="Adventure"
                  />
                </div>
                {/* Adventure info */}
                {isFetchingAdventure && <Skeleton className="w-full h-60" />}
                {adventure && !isFetchingAdventure && (
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
                )}
              </div>
              <Separator className="bg-muted/50" />
              {/* Why did you choose this destination */}
              <FormField
                control={form.control}
                name="why"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>
                      {t("whyDidYouChooseThisDistention?")}
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
              {adventure?.addOns?.length > 0 && (
                <Separator className="bg-muted/50" />
              )}
              {adventure?.addOns?.length > 0 && (
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
                            setAddonsTotal(
                              selected.reduce(
                                (sum, addon) => sum + addon.price,
                                0
                              )
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
                    {isFetchingMyCoupons && (
                      <Skeleton className="w-full h-20" />
                    )}
                    {myCoupons &&
                      myCoupons.length > 0 &&
                      !isFetchingMyCoupons && (
                        <FormControl>
                          <CouponsSelect
                            applyTo="adventure"
                            coupons={myCoupons}
                            defaultSelected={field.value}
                            onSelect={(selected) => {
                              if (selected?.type === "percentage") {
                                setDiscount(
                                  (totalAdventureWithAddons *
                                    (selected.percentOff || 0)) /
                                    100
                                );
                              } else {
                                setDiscount(selected?.value || 0);
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
              {initAdventure.isPartialAllowed && (
                <Separator className="bg-muted/50" />
              )}
              {initAdventure.isPartialAllowed && (
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
                          fullPrice={formatePrice({
                            locale,
                            price: totalFullPrice,
                          })}
                          partialPrice={formatePrice({
                            locale,
                            price: partialPrice,
                          })}
                          partialRemaining={formatePrice({
                            locale,
                            price: partialRemaining,
                          })}
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
              )}
            </div>
            {/* ----------------Adventure Choices---------------- */}
          </div>
        </div>
      </form>
    </Form>
  );
};
