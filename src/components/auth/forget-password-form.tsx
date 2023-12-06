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
import { apiReq } from "@/lib/utils";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ForgetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const t = useTranslations("SignUp");

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

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

  const formSchema = z.object({
    email: z
      .string()
      .email(t("email.errors.invalid"))
      .min(1, t("email.errors.required")),
  });

  const formSchemaOTP = z.object({
    otp: z.string().min(6).max(6),
  });

  const formSchemaPassword = z
    .object({
      password: z.string().min(8, t("password.errors.required")),
      password_confirmation: z.string().min(8),
    })
    .superRefine(({ password_confirmation, password }, ctx) => {
      if (password_confirmation !== password) {
        ctx.addIssue({
          code: "custom",
          message: t("password.errors.confirm"),
          path: ["password_confirmation"],
        });
      }
    });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  const formOTP = useForm<z.infer<typeof formSchemaOTP>>({
    resolver: zodResolver(formSchemaOTP),
    defaultValues: {
      otp: "",
    },
  });

  const formPassword = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmitEmail(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const res = await apiReq({
      endpoint: "/auth/reset-password/create",
      locale,
      method: "POST",
      values: {
        email: values.email,
      },
    }).finally(() => setIsLoading(false));

    if (res.ok) {
      const { message } = await res.json();

      router.push(
        pathname +
          "?" +
          createQueryString([
            { name: "email", value: values.email },
            { name: "otpSent", value: "true" },
          ])
      );

      toast.success(message, { duration: 6000 });
    } else {
      const { message } = await res.json();
      toast.error(message, { duration: 6000 });
    }
  }

  // 2. Define a submit handler.
  async function onSubmitOTP(values: z.infer<typeof formSchemaOTP>) {
    setIsLoading(true);

    const res = await apiReq({
      endpoint: "/auth/reset-password/store",
      locale,
      method: "POST",
      values: {
        email: form.control._fields.email?._f.value,
        otp: values.otp,
      },
    }).finally(() => setIsLoading(false));

    if (res.ok) {
      const { message, token } = await res.json();
      router.push(
        pathname +
          "?" +
          createQueryString([
            { name: "otpVerified", value: "true" },
            { name: "token", value: token },
          ])
      );

      toast.success(message, { duration: 6000 });
    } else {
      const { message } = await res.json();
      toast.error(message, { duration: 6000 });
    }
  }

  async function onPasswordSubmit(values: z.infer<typeof formSchemaPassword>) {
    setIsLoading(true);

    const res = await apiReq({
      endpoint: "/auth/reset-password/update",
      locale,
      method: "POST",
      values: {
        email: searchParams.get("email"),
        token: searchParams.get("token"),
        ...values,
      },
    }).finally(() => setIsLoading(false));

    if (res.ok) {
      const { message } = await res.json();
      router.push(`/`);
      toast.success(message, { duration: 6000 });
    } else {
      const { message } = await res.json();
      toast.error(message, { duration: 6000 });
    }
  }

  return (
    <div className="w-full">
      {!Boolean(searchParams.get("otpSent")) && (
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
                <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
              )}
              {t("sendEmail")}
            </Button>
          </form>
        </Form>
      )}

      {/* OTP */}
      {Boolean(searchParams.get("otpSent")) &&
        !Boolean(searchParams.get("otpVerified")) && (
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
                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                )}
                {t("verifyOTP")}
              </Button>
            </form>
          </Form>
        )}

      {/* Password */}
      {Boolean(searchParams.get("otpVerified")) && (
        <Form {...formPassword}>
          <form
            onSubmit={formPassword.handleSubmit(onPasswordSubmit)}
            className="space-y-8 flex flex-col items-center"
          >
            <FormField
              control={formPassword.control}
              name="password"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>{t("Password")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Password")}
                      className=" border-primary"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formPassword.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("Password")}
                      className=" border-primary"
                      type="password"
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
                <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
              )}
              {t("resetPassword")}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
