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
import { toast } from "sonner";
import { TConsultation } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { Icons } from "../ui/icons";
import { ar, enUS } from "date-fns/locale";

type TCalculateConsultationForm = {
  onPackageChanged: (consultation: TConsultation) => void;
  startDate: (date: Date) => void;
  endDate: (date: Date) => void;
  defaultTier: string;
  hideForm: () => void;
};

export const CalculateConsultation: FC<TCalculateConsultationForm> = ({
  onPackageChanged,
  defaultTier,
  startDate,
  endDate,
  hideForm,
}) => {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  const [totalFullPrice, setTotalFullPrice] = useState<string | null>(null);

  const formSchema = z
    .object({
      package: z.string().min(1, t("destination.errors.required")),
      start_date: z.date().refine((data) => data > new Date(), {
        message: t("startDateMustBeInTheFuture"),
      }),
      end_date: z.date(),
    })
    .refine((data) => data.end_date > data.start_date, {
      message: t("endDateCannotBeBeforeStartDate"),
      path: ["end_date"],
    });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      package: defaultTier,
      start_date: undefined,
      end_date: undefined,
    },
  });

  // const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/consultation/calculate-consultation", {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tier: values.package,
          start_date: format(values.start_date, "dd/MM/yyyy"),
          end_date: format(values.end_date, "dd/MM/yyyy"),
        }),
      });
    },
    async onSuccess(data, values) {
      const { message, data: dataResponse } = await data.json();
      if (data.ok) {
        onPackageChanged(dataResponse);
        startDate(values.start_date);
        endDate(values.end_date);
        setTotalFullPrice(dataResponse.priceWithCurrency ?? null);
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
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-6 flex flex-col items-start w-full"
        >
          <div className="w-full flex flex-col gap-6 ">
            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem className=" w-full mb-2">
                  <FormLabel className="text-base">
                    {t("packageType")}
                    <span className="text-destructive ms-1">*</span>
                  </FormLabel>
                  <Select
                    dir={isRtlLang(locale) ? "rtl" : "ltr"}
                    onValueChange={(e) => {
                      field.onChange(e);
                      hideForm();
                    }}
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
                      <span className="text-destructive ms-1">*</span>
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
                              format(field.value, "PPP", {
                                locale: locale === "ar" ? ar : enUS,
                              })
                            ) : (
                              <span>{t("pickaDate")}</span>
                            )}
                            <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          defaultMonth={field.value}
                          locale={locale === "ar" ? ar : enUS}
                          selected={field.value}
                          onSelect={(e) => {
                            field.onChange(e);
                            hideForm();
                          }}
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
                    <FormLabel className="text-base">
                      {t("endDate")}
                      <span className="text-destructive ms-1">*</span>
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
                              format(field.value, "PPP", {
                                locale: locale === "ar" ? ar : enUS,
                              })
                            ) : (
                              <span>{t("pickaDate")}</span>
                            )}
                            <CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={locale === "ar" ? ar : enUS}
                          selected={field.value}
                          defaultMonth={field.value}
                          onSelect={(e) => {
                            field.onChange(e);
                            hideForm();
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {t("noteMorePeopleMoreMoney")}
            </p>
            <div className="w-full flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
              <p className="text-muted-foreground text-lg">
                <span className="font-bold">{t("price")}:</span>{" "}
                {totalFullPrice}
              </p>

              <Button
                className="w-full sm:max-w-[268px] "
                variant={"secondary"}
                type="submit"
              >
                {" "}
                {mutation.isPending && (
                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                )}
                {t("calculate")}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
