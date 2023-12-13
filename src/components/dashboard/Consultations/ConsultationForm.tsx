"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

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
import { format, min } from "date-fns";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import SelectableCard from "@/components/dashboard/consultations/cardSelection";

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
    { title: t("aResortWith"), imageUrl: "/asset/images/resort.jpg" },
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
    package: z.string().min(1),
    start_date: z.date(),
    end_date: z.date(),
    destination: z.string().min(2, t("destination.errors.required")),
    class: z.string().min(1),
    airport: z.string().min(2, t("airport.errors.required")),
    plus: z.string(),
    budget: z.string().min(2, t("budget.errors.required")),
    bPriority: z.string(),
    budgetIncludes: z
      .array(z.string())
      .refine((value) => value.some((item) => item), {
        message: t("youHaveYoSelectAtLeastOneItem"),
      }),
    vType: z.string(),
    accommodationTypes: z.array(z.string()),
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
    activityTypes: z.array(z.string()),
    travelExperience: z.string(),
    otherFears: z.string(),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(
      "🚀 ~ file: ConsultationForm.tsx:186 ~ onSubmit ~ values:",
      values
    );
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }

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
      accommodationTypes: [],
      adventureToYouIs: [],
      activityTypes: [],
      travelExperience: "",
      otherFears: "",
    },
  });

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-4 md:gap-6 flex flex-col pt-4 items-center"
        >
          {step === 1 && (
            <div>
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
                        <SelectItem value="platinum">
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
                onClick={() => setStep(2)}
              >
                {t("proceed")}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="container mx-auto mt-8">
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

              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="container mx-auto mt-8">
              <FormField
                control={form.control}
                name="vType"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("vacationType")}</FormLabel>
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
              {/* <FormField
                control={form.control}
                name="vType"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel></FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="accommodationTypes"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("whichTypeOfAccomidation")}</FormLabel>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "16px",
                      }}
                    >
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
                                    ? field.onChange([
                                        ...field.value,
                                        item.title,
                                      ])
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
              <div className="grid grid-cols-2 gap-4">
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
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="container mx-auto mt-8">
              <FormField
                control={form.control}
                name="adventureToYouIs"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
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

              <FormField
                control={form.control}
                name="activityTypes"
                render={({ field }) => {
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {cardOptionsSelect.map((card, i) => (
                        <div className="flex flex-col gap-2" key={i}>
                          <div className="relative w-10 h-10">
                            <Image
                              alt="image"
                              className="w-full h-full"
                              fill
                              src={card.image}
                            ></Image>
                          </div>
                          <p>{card.title}</p>
                          <div className="flex flex-col gap-3">
                            {card.options.map((option, j) => (
                              <div key={j}>
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
                  );
                }}
              />

              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{t("whichTypeOfActivities")}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Seeing-one-of-the-worlds-7-wonders" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t(`Seeing-one-of-the-worlds-7-wonders`)}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="hot-air-balloon-experience" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {t("hot-air-balloon-experience")}
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="i-will-only-wake-up-that-early-if-i-have-a-flight-to-catch" />
                          </FormControl>
                          <FormLabel className="font-normal">
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
                  <FormItem className=" w-full">
                    <FormLabel>{t("whatIsTheBestTravelExperience")}</FormLabel>
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
                name="bPriority"
                render={({ field }) => (
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("doYouHaveFears")}</FormLabel>
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
                          {t("gynophobia")}
                        </SelectItem>
                        <SelectItem value="accommodation_five_stars">
                          {t("fearOfFlying")}
                        </SelectItem>
                        <SelectItem value="activities">
                          {t("acrocophobia")}
                        </SelectItem>
                        <SelectItem value="activities">
                          {t("claustrophobia")}
                        </SelectItem>
                        <SelectItem value="activities">
                          {t("insectophobia")}
                        </SelectItem>
                        <SelectItem value="activities">
                          {t("nyctophobia")}
                        </SelectItem>
                        <SelectItem value="activities">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherFears"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("ifOtherType")}</FormLabel>
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
              <div className="grid grid-cols-2 gap-4">
                <div className=" p-4">
                  <Button
                    className="w-full max-w-[268px] "
                    variant={"secondary"}
                    onClick={() => setStep(3)}
                  >
                    {t("back")}
                  </Button>
                </div>
                <div className=" p-4">
                  <Button
                    className="w-full max-w-[268px] "
                    variant={"secondary"}
                    type="submit"
                  >
                    {t("submit")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};
