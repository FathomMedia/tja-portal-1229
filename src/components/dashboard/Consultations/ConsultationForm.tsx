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
      id: "internationalflighttickets",
      label: "International flight tickets",
    },
    {
      id: "accommodation",
      label: "Accommodation",
    },
    {
      id: "transportandfuel",
      label: "Transport & Fuel",
    },
    {
      id: "activities",
      label: "Activities",
    },
    {
      id: "attractionsfees",
      label: "Sightseeing/ Attractions fees",
    },
    {
      id: "travelinsurance",
      label: "Travel Insurance",
    },
    {
      id: "travelconsultationfees",
      label: "Travel consultation fees",
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
    <div>
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
                      <SelectItem value="Economy">{t("silver")}</SelectItem>
                      <SelectItem value="Business">{t("gold")}</SelectItem>
                      <SelectItem value="First Class">
                        {t("platinum")}
                      </SelectItem>
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
              onSubmit={() => setStep(2)}
              className="gap-4 md:gap-6 flex flex-col pt-4 items-center"
            >
              <FormField
                control={form.control}
                name="destination"
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
                name="class"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("packageType")}</FormLabel>
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
                name="plus"
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
                name="budget"
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
                name="bPriority"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("packageType")}</FormLabel>
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
                      <FormLabel className="text-base">Sidebar</FormLabel>
                      <FormDescription>
                        Select the items you want to display in the sidebar.
                      </FormDescription>
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

          {/* <form className="max-w-full mx-auto">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      1. Hello, our name is The Journey Adventures... What about you?
                    </label>
                    <input
                    title="Name"
                      type="text"
                      name="name"
                      className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {`2. What's your email?`}
                    </label>
                    <Input
                     title="Email"
                      type="email"
                      name="email"
                      className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      3. How about your phone number (With the country code please)?
                    </label>
                    <Input
                      title="Phone"
                      type="tel"
                      name="phoneNumber"
                      className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      4. Where are you planning to travel?
                    </label>
                    <Input
                      title="Destination"
                      type="text"
                      name="destination"
                      className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      5. How do you want to travel?
                    </label>
                    <select
                      title="Class"
                      name="travelClass"
                      className=" border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    >
                      <option value="Economy">Economy</option>
                      <option value="Business">Business</option>
                      <option value="FirstClass">First Class</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      6. Which airport are you departing from?
                    </label>
                    <input
                      title="Airport"
                      type="text"
                      name="departureAirport"
                      className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      7. Bringing a plus one (or plus five)?
                    </label>
                    <Input
                    title="plus one"
                      type="text"
                      name="budget"
                      className="appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      8. What is your trip budget (in your preferred currency)?
                    </label>
                    <Input
                    title="budget"
                      type="text"
                      name="budget"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      9. When it comes to budget priority, how would you like to allocate it?
                    </label>
                    <Select
                      name="budgetPriority"
                      required
                    >
                      <option value="">
                        Select one...
                      </option>
                      <option value="BusinessClass">
                        Business class ticket is a must, so more budget for the tickets, less in accommodation and activities.
                      </option>
                      <option value="EconomicalTickets">
                        {`I don't mind economical flight tickets, as long as all my accommodation is five stars standard.`}
                      </option>
                      <option value="ActivitiesPriority">
                        Activities and sightseeing are a priority, I would love to spend more on adventures and programs.
                      </option>
                    </Select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      10. What do you want to include in the budget?
                    </label>
                    <div>
                      <label className="flex items-center">
                        <Input
                          type="checkbox"
                          name="flightTickets"
                        />
                        <span className="text-gray-700">International flight tickets</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="accommodation"
                          className="mr-2"
                        />
                        <span className="text-gray-700">Accommodation</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="transportAndFuel"
                          className="mr-2"
                        />
                        <span className="text-gray-700">Transport & Fuel</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="Activities"
                          className="mr-2"
                        />
                        <span className="text-gray-700">Activities</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="sightseeingAndAttractionsFees"
                          className="mr-2"
                        />
                        <span className="text-gray-700">Sightseeing/ Attractions fees</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="travelInsurance"
                          className="mr-2"
                        />
                        <span className="text-gray-700">Travel Insurance</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="travelConsultationFees"
                          className="mr-2"
                        />
                        <span className="text-gray-700">Travel consultation fees</span>
                      </label>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      11. What type of vacation are you looking for?
                    </label>
                    <select
                      title="Vacation Type"
                      name="vacationType"
                      className=" border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                     
                      required
                    >
                      <option value="">
                        Select one...
                      </option>
                      <option value="DiscoveringCityHopping">More of discovering and city hopping with some adventurous activities between</option>
                      <option value="VeryAdventurous">Very adventurous</option>
                      <option value="MixtureAB">A mixture of A & B</option>
                      <option value="RelaxingAndRomantic">Very relaxing and romantic, more of sightseeing, culture, and shopping</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <button
                      type="submit"
                      className=" bg-[#1E473F] hover:bg-black text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Next 
                    </button>
                  </div>
                </form> */}
        </div>
      )}

      {step === 3 && <div></div>}
    </div>
  );
};
