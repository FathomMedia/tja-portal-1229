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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { apiReq } from "@/lib/apiHelpers";
import { cookies } from "next/headers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const AdminResetPasswordForm = () => {
  const { push } = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("SignInWithPassword");

  // const createQueryString = useCallback(
  //   (pairs: { name: string; value: string }[]) => {
  //     const params = new URLSearchParams(searchParams);
  //     pairs.forEach(({ name, value }) => {
  //       params.set(name, value);
  //     });

  //     return params.toString();
  //   },
  //   [searchParams]
  // );

  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";

  const formSchema = z
    .object({
      email: z
        .string()
        .email(t("email.errors.invalid"))
        .min(1, t("email.errors.required")),
      password: z.string().min(8, t("password.errors.required")),
      password_confirmation: z.string().min(8),
      token: z.string(),
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email,
      token: token,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/authentication/admin-accept-invitation", {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });
    },
    async onSuccess(data, values) {
      const { message, data: dataResponse } = await data.json();
      if (data.ok) {
        queryClient.invalidateQueries({ queryKey: ["/admins/accept"] });
        push(`/${locale}/authentication`);
        toast.success(message, { duration: 6000 });
      } else {
        toast.error(message, { duration: 6000 });
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
    <div>
      <div className="w-full flex flex-col gap-2">
        <Label className="w-full">{t("emailAddress")}</Label>
        <Input disabled value={email} />
      </div>

      <div className="w-full flex flex-col gap-2 mt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 flex w-full flex-col items-center"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className=" w-full flex flex-col">
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
            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem className=" w-full flex flex-col">
                  <FormLabel>{t("password_confirmation.title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("password_confirmation.placeholder")}
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
              Accept Invite
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
