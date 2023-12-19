"use client";

import React, { FC, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TUser } from "@/lib/types";

// minimum age for date of birth
const minAge = 5;
const maxAge = 95;

type TUserAccountDetails = {
  user: TUser;
};

export const UserAccountDetails: FC<TUserAccountDetails> = ({ user }) => {
  const { refresh } = useRouter();
  const locale = useLocale();
  const t = useTranslations("SignInWithPassword");

  const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    date_of_birth: z.date().max(dayjs().subtract(minAge, "year").toDate()),
    gender: z.string().min(1).max(1),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const defaultDate = dayjs(user.dateFormatted).toDate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      date_of_birth: defaultDate,
      gender: user.gender,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    const response = await fetch(`/api/user/update-user-profile`, {
      method: "PUT",
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        date_of_birth: format(values.date_of_birth, "dd/MM/yyyy"),
        gender: values.gender,
      }),
    }).finally(() => {
      setIsLoading(false);
    });

    const res = await response.json();

    if (response.ok) {
      toast.success(res.message);
      refresh();
    } else {
      toast.error(res.message);
    }
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
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"John Smith"}
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
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2 w-full">
                <FormLabel>Date of birth</FormLabel>
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
                <FormLabel>Gender</FormLabel>
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
        <div>
          <div className="w-full flex justify-center sm:justify-end">
            <Button
              className="w-full max-w-[268px] mt-5"
              variant={"secondary"}
              type="submit"
            >
              {isLoading && (
                <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
              )}
              Update
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
