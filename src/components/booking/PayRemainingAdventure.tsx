"use client";
import { TAdventureBookingOrder } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { cn, formatePrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import React, { FC } from "react";
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
import { Icons } from "@/components/ui/icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type TPayRemaining = {
  booking: TAdventureBookingOrder;
  text?: string;
  className?: string;
};

export const PayRemaining: FC<TPayRemaining> = ({
  booking,
  text,
  className,
}) => {
  const t = useTranslations("Adventures");
  const locale = useLocale();
  const { push } = useRouter();

  const formSchema = z.object({
    paymentMethod: z.enum(["benefitpay", "applepay", "card"]),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentMethod: "card",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      var dataToRequest = {
        payment_method: values.paymentMethod,
      };
      return fetch(`/api/book/adventure-remaining`, {
        method: "POST",
        body: JSON.stringify({
          bookingId: booking.id,
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
          toast.error(t("couldntCreateAPaymentSession"), { duration: 6000 });
        }
      } else {
        toast.error(t("couldntCreateAPaymentSession"), { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          size={"sm"}
          className={cn(
            "text-secondary underline hover:text-secondary hover:bg-secondary/10 px-1 py-0",
            className
          )}
        >
          {text ?? t("completePayment")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10"
          >
            <DialogHeader className="gap-1">
              <DialogTitle>{t("completePayment")}</DialogTitle>
              <DialogDescription className="gap-1 flex flex-wrap">
                {t("payTheRemainingAmountOf")}
                <span>
                  {booking.remainingInvoice &&
                    formatePrice({
                      locale,
                      price: booking.remainingInvoice?.totalAmount,
                    })}
                </span>
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="@container/paymentMethod w-full  bg-white/50 p-3 rounded-2xl">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      defaultValue={field.value}
                      className="grid @sm/paymentMethod:grid-cols-2  grid-cols-1 gap-4"
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

            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button className="" type="button" variant="ghost">
                  {t("close")}
                </Button>
              </DialogClose>
              <>
                <Button
                  disabled={mutation.isPending}
                  type="submit"
                  variant={"secondary"}
                >
                  {mutation.isPending && (
                    <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                  )}
                  {t("payNow")}
                </Button>
              </>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
