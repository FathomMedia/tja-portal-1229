"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

export const ConsultationForm = () => {
  const [step, setStep] = useState(1);
  const locale = useLocale();
  const t = useTranslations("Consultation");

  const budgetIncludes = [
    {
      id: "international-flight-tickets",
      label: t("internationalFlightTickets"),
    },
    {
      id: "accommodation",
      label: t("accommodation"),
    },
    {
      id: "transport-and-fuel",
      label: t("transportAndFuel"),
    },
    {
      id: "activities",
      label: t("activities"),
    },
    {
      id: "attractions-fees",
      label: t("sightseeingAndAttractionsFees"),
    },
    {
      id: "travel-insurance",
      label: t("travelInsurance"),
    },
    {
      id: "travel-consultation-fees",
      label: t("travelConsultationFees"),
    },
  ] as const;

  const formSchema = z.object({
    package: z.string().min(1).max(1),
    start_date: z.date(),
    end_date: z.date(),
    destination: z.string().min(2, t("name.errors.required")),
    class: z.string().min(1).max(1),
    airport: z.string().min(2, t("phone.errors.required")),
    plus: z.string(),
    budget: z.string().min(2, t("phone.errors.required")),
    bPriority: z.string(),
    budgetIncludes: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
      }),
    vType: z.string(),
    password_confirmation: z.string().min(8),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      package: "",
      start_date: undefined,
      end_date: undefined,
      destination: "",
      class: "",
      airport: "",
      plus: "",
      budget: "",
      bPriority: undefined,
      budgetIncludes: [],
      vType: "",
    },
  });

  return (
    <div className="">
      {step === 1 && (
        <Form {...form}>
          <form
            onSubmit={() => setStep(2)}
            className="gap-4 md:gap-6 flex flex-col pt-4 items-center"
          >
            <FormField
              control={form.control}
              name="package"
              render={({ field }) => (
                <FormItem className=" w-full mb-2">
                  <FormLabel>{t("packageType")}</FormLabel>
                  <Select
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
                    <FormLabel>{t("startDate")}</FormLabel>
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
                    <FormLabel>{t("endDate")}</FormLabel>
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
            <Button
              className="w-full max-w-[268px] "
              variant={"secondary"}
              type="submit"
            >
              {t("proceed")}
            </Button>
          </form>
        </Form>
      )}

      {step === 2 && (
        <div className="container mx-auto mt-8">
          <Form {...form}>
            <form
              onSubmit={() => setStep(3)}
              className="gap-4 md:gap-6 flex flex-col pt-4 items-center"
            >
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("whereareyoutraveling")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("yourDestination")}
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
                name="class"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("travelClass")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-full border-primary">
                          <SelectValue placeholder={t("selectClass")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Economy">{t("economy")}</SelectItem>
                        <SelectItem value="Business">
                          {t("business")}
                        </SelectItem>
                        <SelectItem value="First Class">
                          {t("firstClass")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airport"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("whichAirport")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("airportName")}
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
                name="plus"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("plusOne")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("numberOfcompanions")}
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
                name="budget"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("budgetAmount")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("budgetexample")}
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
                name="bPriority"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("budgetPriority")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-full border-primary">
                          <SelectValue placeholder={t("selectOne")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="business_class_ticket">
                          {t("business_class_ticket")}
                        </SelectItem>
                        <SelectItem value="accommodation_five_stars">
                          {t("accommodation_five_stars")}
                        </SelectItem>
                        <SelectItem value="activities">
                          {t("activitiesAndPrograms")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetIncludes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        {t("budgetToInclude")}
                      </FormLabel>
                    </div>
                    {budgetIncludes.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="budgetIncludes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          item.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full max-w-[268px] "
                variant={"secondary"}
                type="submit"
              >
                {t("next")}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {step === 3 && (
        <div className="container mx-auto mt-8">
          <Form {...form}>
            <form
              onSubmit={() => setStep(3)}
              className="gap-4 md:gap-6 flex flex-col pt-4 items-center"
            >
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("travelClass")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-full border-primary">
                          <SelectValue placeholder={t("selectOne")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="More-Discovering">
                          {t("moreDiscovering ")}
                        </SelectItem>
                        <SelectItem value="More-Adventurous">
                          {t("veryAdventurous")}
                        </SelectItem>
                        <SelectItem value="Mix-of-A-B">
                          {t("mixofAandB")}
                        </SelectItem>
                        <SelectItem value="Very-Relaxing">
                          {t("veryRelaxing")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Accommodation Type Here */}
              <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel></FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};
