"use client";

import React, { useCallback, useState } from "react";
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
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";

export const UserUpdateEmail = () => {
  const t = useTranslations("SignUp");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

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

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (pairs: { name: string; value: string }[]) => {
      const params = new URLSearchParams(searchParams);
      pairs.forEach(({ name, value }) => {
        params.set(name, value);
      });

      return params.toString();
    },
    [searchParams]
  );

  const queryClient = useQueryClient();

  const mutationEmail = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/user/send-update-email-otp", {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });
    },
    async onSuccess(data, values) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        router.push(
          pathname +
            "?" +
            createQueryString([
              { name: "email", value: values.email },
              { name: "otpSent", value: "true" },
            ])
        );
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  const mutationOTP = useMutation({
    mutationFn: (values: z.infer<typeof formSchemaOTP>) => {
      return fetch(`/api/user/update-user-email`, {
        method: "PUT",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: searchParams.get("email"),
          otp: values.otp,
        }),
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/users/profile"] });
        router.push(pathname);
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
  async function onSubmitEmail(values: z.infer<typeof formSchema>) {
    mutationEmail.mutate(values);
  }
  // 2. Define a submit handler.
  async function onSubmitOTP(values: z.infer<typeof formSchemaOTP>) {
    mutationOTP.mutate(values);
  }

  return (
    <div>
      {!Boolean(searchParams.get("otpSent")) && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitEmail)}
            className="space-y-8 flex flex-col items-center"
          >
            <div className=" w-full grid grid-cols-1 items-end gap-6 sm:grid-cols-2">
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
              <div className=" w-full flex justify-center sm:justify-end">
                <Button
                  className="w-full max-w-[268px] mt-8 "
                  variant={"secondary"}
                  type="submit"
                >
                  {mutationEmail.isPending && (
                    <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                  )}
                  {t("verifyEmail")}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}

      {/* OTP */}
      {Boolean(searchParams.get("otpSent")) && (
        <Form {...formOTP}>
          <form
            onSubmit={formOTP.handleSubmit(onSubmitOTP)}
            className="grid grid-cols-1 items-end sm:grid-cols-2"
          >
            <div className=" flex flex-col gap-6">
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
            </div>
            <div className=" w-full flex justify-center sm:justify-end">
              <Button
                className="w-full max-w-[268px]"
                variant={"secondary"}
                type="submit"
              >
                {mutationOTP.isPending && (
                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                )}
                Update
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
