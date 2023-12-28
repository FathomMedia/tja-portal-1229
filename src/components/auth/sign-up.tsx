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
import dayjs from "dayjs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useReCaptcha } from "next-recaptcha-v3";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PhoneNumberInput } from "../ui/phone";

// minimum age for date of birth
const minAge = 5;
const maxAge = 95;

export const SignUp = () => {
  const t = useTranslations("SignUp");
  const { refresh } = useRouter();

  const formSchema = z
    .object({
      email: z
        .string()
        .email(t("email.errors.invalid"))
        .min(1, t("email.errors.required")),
      date_of_birth: z.date().max(dayjs().subtract(minAge, "year").toDate()),
      name: z.string().min(2, t("name.errors.required")),
      phone: z.string().min(2, t("phone.errors.required")),
      gender: z.string().min(1).max(1),
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

  const { executeRecaptcha } = useReCaptcha();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const locale = useLocale();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      date_of_birth: undefined,
      name: "",
      phone: "",
      gender: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const recaptcha_token = await executeRecaptcha("sign_up");

    const dataToSend = {
      ...values,
      date_of_birth: format(values.date_of_birth, "dd/MM/yyyy"),
      recaptcha_token,
    };

    const res = await fetch(`/api/authentication/sign-up`, {
      method: "POST",
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    }).finally(() => setIsLoading(false));

    const { message } = await res.json();

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
        className="gap-4 md:gap-6 flex flex-col pt-4 items-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-3 items-center justify-between">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("Name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("Enter your name")}
                    className=" border-primary"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("Phone")}</FormLabel>
                <FormControl>
                  <PhoneNumberInput
                    placeholder={t("Phone")}
                    className=" border-primary w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <div className="flex gap-3 flex-col sm:flex-row items-center w-full justify-between">
          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>{t("dateOfBirth")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl className="w-full flex">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-primary",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t("pickaDate")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      captionLayout={"dropdown"}
                      fromYear={dayjs().subtract(maxAge, "year").year()}
                      toYear={dayjs().subtract(minAge, "year").year()}
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > dayjs().subtract(minAge, "year").toDate() ||
                        date < dayjs().subtract(maxAge, "year").toDate()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
                      <SelectValue placeholder={t("Select gender")} />
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("Password")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="Password"
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
          {isLoading && <Icons.spinner className="me-2 h-4 w-4 animate-spin" />}
          {t("Register")}
        </Button>
      </form>
    </Form>
  );
};
