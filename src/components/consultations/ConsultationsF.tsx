"use client";
import React, { FC, useEffect, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

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
import { useLocale, useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import SelectableCard from "@/components/consultations/CardSelection";
import { isRtlLang } from "rtl-detect";
import { TConsultation } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  accommodationTypes,
  adventureToYouIs,
  budgetIncludes,
  cardOptionsSelect,
} from "./consultation-constants";
import { ConsultationCheckoutForm } from "../checkout/ConsultationCheckoutForm";
import { Card, CardContent } from "../ui/card";

type TConsultationForm = {
  chosenPackage: TConsultation;
  startDate: Date;
  endDate: Date;
};

export const ConsultationForm: FC<TConsultationForm> = ({
  chosenPackage,
  startDate,
  endDate,
}) => {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  const [fearSelection, setFearSelection] = useState<string | undefined>(
    undefined
  );

  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(
    null
  );

  const [isOpen, setIsOpen] = useState(false);

  const itemsPerRow = 4;

  // Calculate the number of rows based on the items and itemsPerRow
  const numRows = Math.ceil(accommodationTypes.length / itemsPerRow);
  // Generate an array of row indices
  const rowIndices = Array.from({ length: numRows }, (_, index) => index);

  const formSchema = z.object({
    packageId: z
      .number()
      .min(1, "Missing package details. Please fill in the details above."),
    startDate: z.date(),
    endDate: z.date(),
    destination: z.string().min(2, t("destination.errors.required")),
    class: z.string().min(1, t("destination.errors.required")),
    airport: z.string().min(2, t("airport.errors.required")),
    plus: z.number().min(1, "Number of travelers are required"),
    budget: z.string().min(2, t("budget.errors.required")),
    bPriority: z.string().min(1, t("destination.errors.required")),
    budgetIncludes: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: t("youHaveYoSelectAtLeastOneItem"),
      }),
    vType: z.string().min(1, t("destination.errors.required")),
    accommodationTypes: z
      .array(z.string())
      .min(1, t("destination.errors.required")),
    adventureToYouIs: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: t("youHaveYoSelectAtLeastOneItem"),
      }),
    tripType: z.enum(
      [
        "Seeing-one-of-the-worlds-7-wonders",
        "hot-air-balloon-experience",
        "i-will-only-wake-up-that-early-if-i-have-a-flight-to-catch",
      ],
      {
        required_error: t("youHaveYoSelectAtLeastOneItem"),
      }
    ),
    activityTypes: z
      .array(z.string())
      .min(1, t("youHaveYoSelectAtLeastOneItem")),
    travelExperience: z.string(),
    fearsSelection: z.string().optional(),
    otherFears: z.string().optional(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      packageId: chosenPackage.id,
      startDate: startDate,
      endDate: endDate,
      destination: "",
      class: "",
      airport: "",
      plus: 0,
      budget: "",
      bPriority: "",
      budgetIncludes: [],
      vType: "",
      accommodationTypes: [],
      adventureToYouIs: [],
      activityTypes: [],
      travelExperience: "",
      otherFears: "",
    },
  });

  useEffect(() => {
    form.setValue("packageId", chosenPackage.id);
    startDate && form.setValue("startDate", startDate);
    endDate && form.setValue("endDate", endDate);

    return () => {};
  }, [chosenPackage, startDate, endDate, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // TODO : pass values to checkout sheet

    setFormData(values);
    console.log(formData);
    setIsOpen(true);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-10 flex flex-col"
        >
          <FormField
            control={form.control}
            name="packageId"
            render={({ fieldState }) => (
              <FormItem
                className={cn(" w-full hidden", fieldState.error && "flex")}
              >
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ fieldState }) => (
              <FormItem
                className={cn(" w-full hidden", fieldState.error && "flex")}
              >
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ fieldState }) => (
              <FormItem
                className={cn(" w-full hidden", fieldState.error && "flex")}
              >
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="w-full flex flex-col gap-6"> */}
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel className="text-base">
                  {t("whereareyoutraveling")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
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
                <FormLabel className="text-base">
                  {t("travelClass")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <Select
                  dir={isRtlLang(locale) ? "rtl" : "ltr"}
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
                    <SelectItem value="Business">{t("business")}</SelectItem>
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
                <FormLabel className="text-base">
                  {t("whichAirport")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
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
                <FormLabel className="text-base">
                  {t("plusOne")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("numberOfcompanions")}
                    className=" border-primary"
                    type="number"
                    {...field}
                    onChange={(event) =>
                      field.onChange(Number(event.target.value))
                    }
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
                <FormLabel className="text-base">
                  {t("budgetAmount")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
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
                <FormLabel className="text-base">
                  {t("budgetPriority")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <Select
                  dir={isRtlLang(locale) ? "rtl" : "ltr"}
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
                    <span className="text-destructive ms-1">*</span>
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
                          className="flex flex-row items-start gap-3 space-y-0 py-1"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t(item.label)}
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
          {/* </div> */}
          {/* )} */}

          {/* {step === 3 && ( */}
          {/* <div className="w-full  flex flex-col gap-6"> */}
          <FormField
            control={form.control}
            name="vType"
            render={({ field }) => (
              <FormItem className=" w-full mb-2 ">
                <FormLabel className="text-base">
                  {t("vacationType")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <Select
                  dir={isRtlLang(locale) ? "rtl" : "ltr"}
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

          <FormField
            control={form.control}
            name="accommodationTypes"
            render={({ field }) => (
              <FormItem className=" w-full mb-2 ">
                <FormLabel className="text-base">
                  {t("whichTypeOfAccomidation")}
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {rowIndices.map((rowIndex) => (
                    <React.Fragment key={rowIndex}>
                      {accommodationTypes
                        .slice(
                          rowIndex * itemsPerRow,
                          (rowIndex + 1) * itemsPerRow
                        )
                        .map((item, index) => (
                          <SelectableCard
                            key={index}
                            title={t(item.title)}
                            imageUrl={item.imageUrl}
                            onSelect={(isSelected) =>
                              isSelected
                                ? field.onChange([
                                    ...field.value,
                                    t(item.title),
                                  ])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== t(item.title)
                                    )
                                  )
                            }
                          />
                        ))}
                    </React.Fragment>
                  ))}
                </div>
              </FormItem>
            )}
          />
          {/* </div> */}

          {/* {step === 4 && ( */}
          {/* <div className="w-full  flex flex-col gap-6"> */}
          <FormField
            control={form.control}
            name="adventureToYouIs"
            render={() => (
              <FormItem>
                <div className="mb-4 ">
                  <FormLabel className="text-base">
                    {t("ToyouAdventureIs")}
                    <span className="text-destructive ms-1">*</span>
                  </FormLabel>
                </div>
                {adventureToYouIs.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="adventureToYouIs"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start gap-2 space-y-0 py-1"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t(item.label)}
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

          <FormField
            control={form.control}
            name="activityTypes"
            render={({ field }) => {
              return (
                <FormItem className="">
                  <div className="mb-4 ">
                    <FormLabel className="text-base">
                      {t("whichTypeOfActivities")}
                      <span className="text-destructive ms-1">*</span>
                    </FormLabel>
                  </div>
                  <Card className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-6">
                    {cardOptionsSelect.map((card, i) => (
                      <div className="flex flex-col gap-2" key={i}>
                        <div className="relative w-full h-40 ">
                          <Image
                            alt="image"
                            className="object-cover rounded-md"
                            fill
                            src={card.image}
                            sizes="50vw"
                            priority={false}
                          ></Image>
                        </div>
                        <p className=" text-md text-primary  font-helveticaNeue font-black ">
                          {t(card.title)}
                        </p>
                        <div className="flex flex-col gap-5">
                          {card.options.map((option, j) => (
                            <div className="flex gap-2 items-center" key={j}>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        option.id,
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== option.id
                                        )
                                      );
                                }}
                              />
                              <FormLabel className="font-normal">
                                {t(option.label)}
                              </FormLabel>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </Card>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="tripType"
            render={({ field }) => (
              <FormItem className="space-y-3 ">
                <FormLabel className="text-base">
                  {
                    "If you had to wake up at 5 am to chase a program/activity, which one would you wake up that early for?"
                  }
                  <span className="text-destructive ms-1">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    dir={isRtlLang(locale) ? "rtl" : "ltr"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Seeing-one-of-the-worlds-7-wonders" />
                      </FormControl>
                      <FormLabel className="font-normal pr-2 pl-2">
                        {t("Seeing-one-of-the-worlds-7-wonders")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="hot-air-balloon-experience" />
                      </FormControl>
                      <FormLabel className="font-normal pr-2 pl-2">
                        {t("hot-air-balloon-experience")}
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="i-will-only-wake-up-that-early-if-i-have-a-flight-to-catch" />
                      </FormControl>
                      <FormLabel className="font-normal pr-2 pl-2">
                        {t(
                          "i-will-only-wake-up-that-early-if-i-have-a-flight-to-catch"
                        )}
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="travelExperience"
            render={({ field }) => (
              <FormItem className=" w-full ">
                <FormLabel className="text-base">
                  {t("whatIsTheBestTravelExperience")}
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t("describe")}
                    className=" border-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fearsSelection"
            render={({ field }) => (
              <FormItem className=" w-full mb-2 ">
                <FormLabel className="text-base">
                  {t("doYouHaveFears")}
                </FormLabel>
                <Select
                  dir={isRtlLang(locale) ? "rtl" : "ltr"}
                  onValueChange={(value) => {
                    setFearSelection(value);
                    field.onChange(value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-full border-primary">
                      <SelectValue placeholder={t("selectOne")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="gynophobia">
                      {t("gynophobia")}
                    </SelectItem>
                    <SelectItem value="fearOfFlying">
                      {t("fearOfFlying")}
                    </SelectItem>
                    <SelectItem value="acrocophobia">
                      {t("acrocophobia")}
                    </SelectItem>
                    <SelectItem value="claustrophobia">
                      {t("claustrophobia")}
                    </SelectItem>
                    <SelectItem value="insectophobia">
                      {t("insectophobia")}
                    </SelectItem>
                    <SelectItem value="nyctophobia">
                      {t("nyctophobia")}
                    </SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {fearSelection === "other" && (
            <FormField
              control={form.control}
              name="otherFears"
              render={({ field }) => (
                <FormItem className=" w-full ">
                  <FormLabel className="text-base">
                    {t("ifOtherType")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      className=" border-primary"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="packageId"
            render={({ fieldState }) => (
              <FormItem
                className={cn(" w-full hidden", fieldState.error && "flex")}
              >
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ fieldState }) => (
              <FormItem
                className={cn(" w-full hidden", fieldState.error && "flex")}
              >
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ fieldState }) => (
              <FormItem
                className={cn(" w-full hidden", fieldState.error && "flex")}
              >
                <FormMessage />
              </FormItem>
            )}
          />

          <div className=" w-full flex justify-center sm:justify-end">
            <Button
              className="w-full max-w-[268px] "
              variant={"secondary"}
              type="submit"
            >
              {t("submit")}
            </Button>
          </div>
          {/* </div> */}
        </form>
      </Form>
      {formData && (
        <ConsultationCheckoutForm
          consultation={chosenPackage}
          formData={formData}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};
