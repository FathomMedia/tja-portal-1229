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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { isRtlLang } from "rtl-detect";
import toast from "react-hot-toast";

export const CalculateConsultation: FC = () => {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z.object({
    package: z.string().min(1, t("destination.errors.required")),
    start_date: z.date(),
    end_date: z.date(),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const res = await fetch("/api/consultation", {
      method: "POST",
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tier: values.package,
        start_date: values.start_date,
        end_date: values.end_date,
      }),
    }).finally(() => setIsLoading(false));

    if (res.ok) {
      const { message } = await res.json();

      //   router.push(
      //     pathname +
      //       "?" +
      //       createQueryString([
      //         { name: "email", value: values.email },
      //         { name: "otpSent", value: "true" },
      //       ])
      //   );

      toast.success(message, { duration: 6000 });
    } else {
      const { message } = await res.json();
      toast.error(message, { duration: 6000 });
    }
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      package: "",
      start_date: undefined,
      end_date: undefined,
    },
  });

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-6 flex flex-col items-start"
        >
          <div className="w-full flex flex-col gap-6">
            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem className=" w-full mb-2">
                  <FormLabel className="text-base">
                    {t("packageType")}
                  </FormLabel>
                  <Select
                    dir={isRtlLang(locale) ? "rtl" : "ltr"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-full border-primary">
                        <SelectValue placeholder={t("selectPackage")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="silver">{t("silver")}</SelectItem>
                      <SelectItem value="gold">{t("gold")}</SelectItem>
                      <SelectItem value="platinum">{t("platinum")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-3 flex-col sm:flex-row items-center w-full justify-between">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-base">
                      {t("startDate")}
                    </FormLabel>
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
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
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
                name="end_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="text-base">{t("endDate")}</FormLabel>
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
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full flex justify-center sm:justify-end">
              <Button
                disabled={
                  form.getFieldState("package").invalid ||
                  form.getFieldState("start_date").invalid ||
                  form.getFieldState("end_date").invalid
                }
                className="w-full max-w-[268px] "
                variant={"secondary"}
                onClick={() => {
                  // setStep(2)
                }}
              >
                {"Calculate"}
              </Button>
            </div>
          </div>

          {/* <div className=" p-4">
            <Button
              className="w-full max-w-[268px] "
              variant={"secondary"}
              type="submit"
            >
              {t("submit")}
            </Button>
          </div> */}
        </form>
      </Form>
    </div>
  );
};
