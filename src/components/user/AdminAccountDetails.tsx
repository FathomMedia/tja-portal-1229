"use client";

import React, { FC } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { TUser } from "@/lib/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

type TAdminAccountDetails = {
  user: TUser;
};

export const AdminAccountDetails: FC<TAdminAccountDetails> = ({ user }) => {
  const locale = useLocale();
  const t = useTranslations("SignInWithPassword");

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),

    gender: z.string().min(1).max(1),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      gender: user.gender,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch(`/api/user/update-user-profile`, {
        method: "PUT",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataToSend: { name: values.name, gender: values.gender },
        }),
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/users/profile"] });
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 items-end"
      >
        <div className=" flex flex-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("name")}
                    className=" border-primary"
                    type="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className=" w-full mb-2">
                <FormLabel>{t("gender")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-full border-primary">
                      <SelectValue placeholder={t("selectGender")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">{t("male")}</SelectItem>
                    <SelectItem value="F">{t("female")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <div className="w-full flex justify-center sm:justify-end">
            <Button
              className="w-full max-w-[268px] mt-5"
              variant={"secondary"}
              type="submit"
            >
              {mutation.isPending && (
                <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
              )}
              {t("update")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
