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
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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

  const adventureToYouIs = [
    {
      id: "visiting-a-stunning-place-and-try-hard-to-climb-a-challenging-mountain-to-enjoy-a-panoramic-view-at-the-end",
      label: t("visitingAStunningPlace"),
    },
    {
      id: "being-out-in-wild-nature",
      label: t("beingOutInWildNature"),
    },
    {
      id: "over-coming-a-fear",
      label: t("overComingAFear"),
    },
    {
      id: "extreme-sports",
      label: t("extremeSports"),
    },
    {
      id: "beaches-and-water-sports",
      label: t("BeachesAndWaterSports"),
    },
    {
      id: "camping-outdoors",
      label: t("campingOutdoors"),
    },
    {
      id: "sightseeing-and-learning-about-new-cultures",
      label: t("sightseeingAndLearning"),
    },
    {
      id: "get-lost-somewhere-with-no-connection",
      label: t("getLostSomewhere"),
    },
    {
      id: "trying-new-activities-in-new-places",
      label: t("TryingNewActivities"),
    },
    {
      id: "national-parks-animals-and-wild-life",
      label: t("nationalParksAndAnimals"),
    },
  ] as const;

  const accommodationTypes = [
    { title: t("aResortWith"), imageUrl: "/assets/images/resort.jpg" },
    {
      title: t("fiveStarHotel"),
      imageUrl: "/assets/images/5-star-hotel.jpg",
    },
    { title: t("romanticCabins"), imageUrl: "/assets/images/cabins.jpg" },
    {
      title: t("bedAndBreakfast"),
      imageUrl: "/assets/images/bedAndBreakfast.jpg",
    },
    { title: t("holidayHomes"), imageUrl: "/assets/images/holidayHomes.jpg" },
    {
      title: t("servicedApartments"),
      imageUrl: "/assets/images/servicedApartments.jpg",
    },
    { title: t("glamping"), imageUrl: "/assets/images/glamping.jpg" },
    { title: t("tents"), imageUrl: "/assets/images/tents.jpg" },
    { title: t("caravans"), imageUrl: "/assets/images/caravans.jpg" },
    { title: t("hostels"), imageUrl: "/assets/images/hostels.jpg" },
    { title: t("homestays"), imageUrl: "/assets/images/homestays.jpg" },
    // Add more items as needed
  ];

  const itemsPerRow = 4;

  // Calculate the number of rows based on the items and itemsPerRow
  const numRows = Math.ceil(accommodationTypes.length / itemsPerRow);

  // Generate an array of row indices
  const rowIndices = Array.from({ length: numRows }, (_, index) => index);

  const formSchema = z.object({
    packageId: z
      .number()
      .min(1, "Missing package details. Please fill in the details above."),
    startDate: z.date().min(new Date(2023, 12, 23)),
    endDate: z.date(),
    destination: z.string().min(2, t("destination.errors.required")),
    class: z.string().min(1, t("destination.errors.required")),
    airport: z.string().min(2, t("airport.errors.required")),
    plus: z.string(),
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

  const cardOptionsSelect: {
    image: string;
    title: string;
    options: {
      id: string;
      label: string;
    }[];
  }[] = [
    {
      image: "/assets/images/adrenalineAdventures.jpg",
      title: t("adrenalineAdventures"),
      options: [
        { id: "skydiving", label: t("skydiving") },
        { id: "bungee-jumping", label: t("bungeeJumping") },
        { id: "paragliding", label: t("paragliding") },
      ],
    },
    {
      image: "/assets/images/outdoorsAdventures.jpg",
      title: t("outdoorsAdventures"),
      options: [
        { id: "snowmobiling", label: t("snowmobiling") },
        { id: "cycling", label: t("cycling") },
        { id: "camping", label: t("camping") },
        { id: "hiking", label: t("hiking") },
        { id: "via-ferrata", label: t("viaFerrata") },
      ],
    },
    {
      image: "/assets/images/waterAdventures.jpg",
      title: t("waterAdventures"),
      options: [
        { id: "rafting", label: t("rafting") },
        { id: "swimming", label: t("swimming") },
        { id: "snorkelling", label: t("snorkelling") },
        { id: "diving", label: t("diving") },
        { id: "kayaking", label: t("kayaking") },
        { id: "scuba-diving", label: t("scubaDiving") },
      ],
    },
    {
      image: "/assets/images/skyAdventures.jpg",
      title: t("skyAdventures"),
      options: [
        { id: "helicopter-tours", label: t("helicopterTours") },
        { id: "hot-air-balloon", label: t("hotAirBalloon") },
        { id: "ziplining", label: t("ziplining") },
      ],
    },
    {
      image: "/assets/images/wildlifeExperiences.jpg",
      title: t("wildlifeExperiences"),
      options: [
        { id: "horse-riding", label: t("horseRiding") },
        { id: "safari-and-game-drives", label: t("safariAndGameDrives") },
        { id: "kayak-with-penguins", label: t("kayakWithPenguins") },
        { id: "diving-with-whale-sharks", label: t("divingWithWhaleSharks") },
      ],
    },
    {
      image: "/assets/images/culturalExperiences.jpg",
      title: t("culturalExperiences"),
      options: [
        {
          id: "cultural-tours-and-workshops",
          label: t("culturalToursAndWorkshops"),
        },
        { id: "cooking-classes", label: t("cookingClasses") },
      ],
    },
  ];

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
      plus: "",
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
    console.log("called");

    form.setValue("packageId", chosenPackage.id);
    startDate && form.setValue("startDate", startDate);
    endDate && form.setValue("endDate", endDate);

    return () => {};
  }, [chosenPackage, startDate, endDate, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(
      "🚀 ~ file: ConsultationForm.tsx:186 ~ onSubmit ~ values:",
      values
    );
    const formatted = format(values.endDate, "dd/MM/yyyy");
    console.log("formatted", formatted);

    console.log("chosen package id", chosenPackage);
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-10 flex flex-col items-end"
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

          <div className="w-full flex flex-col gap-6">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel className="text-base">
                    {t("whereareyoutraveling")}
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
                  <FormLabel className="text-base">{t("plusOne")}</FormLabel>
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
                  <FormLabel className="text-base">
                    {t("budgetAmount")}
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
                            className="flex flex-row items-start gap-3 space-y-0"
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

            {/* <div className="grid grid-cols-2 gap-4">
                <div className=" p-4">
                  <Button
                    className="w-full max-w-[268px] "
                    variant={"secondary"}
                    onClick={() => setStep(1)}
                  >
                    {t("back")}
                  </Button>
                </div>
                <div className=" p-4">
                  <Button
                    className="w-full max-w-[268px] "
                    variant={"secondary"}
                    onClick={() => setStep(3)}
                  >
                    {t("next")}
                  </Button>
                </div>
              </div> */}
          </div>
          {/* )} */}

          {/* {step === 3 && ( */}
          <div className="w-full  flex flex-col gap-6">
            <FormField
              control={form.control}
              name="vType"
              render={({ field }) => (
                <FormItem className=" w-full mb-2 ">
                  <FormLabel className="text-base">
                    {t("vacationType")}
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
            {/* <FormField
                control={form.control}
                name="vType"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel className="text-base"></FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

            <FormField
              control={form.control}
              name="accommodationTypes"
              render={({ field }) => (
                <FormItem className=" w-full mb-2 max-w-3xl">
                  <FormLabel className="text-base">
                    {t("whichTypeOfAccomidation")}
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
                              title={item.title}
                              imageUrl={item.imageUrl}
                              onSelect={(isSelected) =>
                                isSelected
                                  ? field.onChange([...field.value, item.title])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.title
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
            {/* <div className="grid grid-cols-2 gap-4">
                <div className=" p-4">
                  <Button
                    className="w-full max-w-[268px] "
                    variant={"secondary"}
                    onClick={() => setStep(2)}
                  >
                    {t("back")}
                  </Button>
                </div>
                <div className=" p-4">
                  <Button
                    className="w-full max-w-[268px] "
                    variant={"secondary"}
                    onClick={() => setStep(4)}
                  >
                    {t("next")}
                  </Button>
                </div>
              </div> */}
          </div>
          {/* )} */}

          {/* {step === 4 && ( */}
          <div className="w-full  flex flex-col gap-6">
            <FormField
              control={form.control}
              name="adventureToYouIs"
              render={() => (
                <FormItem>
                  <div className="mb-4 ">
                    <FormLabel className="text-base">
                      {t("ToyouAdventureIs")}
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
                            className="flex flex-row items-start gap-2 space-y-0"
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

            <FormField
              control={form.control}
              name="activityTypes"
              render={({ field }) => {
                return (
                  <FormItem className="">
                    <div className="mb-4 ">
                      <FormLabel className="text-base">
                        {t("whichTypeOfActivities")}
                      </FormLabel>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-3xl">
                      {cardOptionsSelect.map((card, i) => (
                        <div className="flex flex-col gap-2" key={i}>
                          <div className="relative w-full h-20">
                            <Image
                              alt="image"
                              className="object-cover"
                              fill
                              src={card.image}
                              sizes="50vw"
                              priority={false}
                            ></Image>
                          </div>
                          <p className=" text-md ">{card.title}</p>
                          <div className="flex flex-col gap-3">
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
                                  {option.label}
                                </FormLabel>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
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
                    {t("ifYouHadToWakeUpAt5AmToChaseAProgram")}
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
                          {t(`Seeing-one-of-the-worlds-7-wonders`)}
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
          </div>
        </form>
      </Form>
    </div>
  );
};
