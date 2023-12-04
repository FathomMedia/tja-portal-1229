"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useTranslations } from "next-intl";

export const SignInWithEmailOTP = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOTPSent, setOTPSent] = useState<boolean>(false);

  // const t= useTranslations("Auth");

  const t = useTranslations("SignUp");

  const formSchema = z.object({
    email: z
      .string()
      .email(t("email.errors.invalid"))
      .min(1, t("email.errors.required")),
  });
  const formSchemaOTP = z.object({
    otp: z.string().min(4),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const formOTP = useForm<z.infer<typeof formSchemaOTP>>({
    resolver: zodResolver(formSchemaOTP),
    defaultValues: {
      otp: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmitEmail(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      setOTPSent(true);
      throw new Error("Unimplemented Error");
    }, 3000);
  }
  // 2. Define a submit handler.
  async function onSubmitOTP(values: z.infer<typeof formSchemaOTP>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      throw new Error("Unimplemented Error");
    }, 3000);
  }

  return (
    <div>
      {!isOTPSent && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitEmail)}
            className="space-y-8 flex flex-col items-center"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>{t("emailAddress")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className=" border-primary"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full max-w-[268px]"
              variant={"secondary"}
              type="submit"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("sendEmail")}
            </Button>
          </form>
        </Form>
      )}

      {/* OTP */}
      {isOTPSent && (
        <Form {...formOTP}>
          <form
            onSubmit={formOTP.handleSubmit(onSubmitOTP)}
            className="space-y-8 flex flex-col items-center"
          >
            <FormField
              disabled
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>{t("emailAddress")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className=" border-primary"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={formOTP.control}
              name="otp"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>{t("OTP")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("OTPSentToTheAboveEmail")}
                      className=" border-primary"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full max-w-[268px]"
              variant={"secondary"}
              type="submit"
            >
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {t("submit")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
