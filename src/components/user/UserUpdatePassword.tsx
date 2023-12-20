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
import { useLocale, useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const UpdatePassword = () => {
  const { refresh } = useRouter();
  const t = useTranslations("UpdatePassword");

  const formSchema = z
    .object({
      old_password: z.string().min(1),
      new_password: z.string().min(8, t("new_password.errors.required")),
      new_password_confirmation: z.string().min(8),
    })
    .superRefine(({ new_password_confirmation, new_password }, ctx) => {
      if (new_password_confirmation !== new_password) {
        ctx.addIssue({
          code: "custom",
          message: t("password.errors.confirm"),
          path: ["password_confirmation"],
        });
      }
    });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const locale = useLocale();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const dataToSend = {
      ...values,
    };
    console.log(
      "🚀 ~ file: UserUpdatePassword.tsx:62 ~ onSubmit ~ dataToSend:",
      dataToSend
    );

    // TODO: move this to api route and set the token in the cookies
    const res = await fetch("/api/user/update-user-password", {
      method: "PUT",
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...values,
      }),
    }).finally(() => setIsLoading(false));

    const { data, message } = await res.json();
    console.log(
      "🚀 ~ file: UserUpdatePassword.tsx:81 ~ onSubmit ~ data:",
      data
    );

    if (res.ok) {
      toast.success(message, { duration: 6000 });
      refresh();
    } else {
      toast.error(message);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="gap-4 md:gap-6 grid grid-cols-1 pt-4 items-end sm:grid-cols-2"
      >
        <div className=" flex flex-col gap-6">
          <FormField
            control={form.control}
            name="old_password"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("oldPassword")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("oldPassword")}
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
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("newPassword")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("newPassword")}
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
            control={form.control}
            name="new_password_confirmation"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("confirmNewPassword")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("confirmNewPassword")}
                    className=" border-primary"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="w-full flex justify-center sm:justify-end">
          <Button
            className="w-full max-w-[268px]"
            variant={"secondary"}
            type="submit"
          >
            {isLoading && (
              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
            )}
            {t("update")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
