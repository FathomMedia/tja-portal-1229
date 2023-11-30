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
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { apiReq } from "@/lib/utils";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const SignInWithPassword = () => {
  const { push } = useRouter();
  const locale = useLocale();
  const t = useTranslations("SignInWithPassword");
  const formSchema = z.object({
    email: z
      .string()
      .email(t("email.errors.invalid"))
      .min(1, t("email.errors.required")),
    password: z.string().min(2, t("password.errors.required")),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    const response = await fetch(
      `/api/authentication/sign-in-with-email-password`,
      {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      }
    ).finally(() => {
      setIsLoading(false);
    });

    const res = await response.json();

    const user = res.data;

    if (response.ok) {
      toast.success(res.message);
      push("/");
    } else {
      toast.error(res.message);
    }

    // TODO: toast for errors
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 flex flex-col items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("email.title")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("email.placeholder")}
                  className=" border-primary"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("password.title")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("password.placeholder")}
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
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {t("signIn")}
        </Button>
        <Link
          className="text-sm text-primary"
          href={`${locale}/authentication/forgot-password`}
        >
          {t("lostPassword")}
        </Link>
      </form>
    </Form>
  );
};
