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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import dayjs from "dayjs";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TAdventure, TCountry } from "@/lib/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { imagesApi } from "@/config";
import Image from "next/image";

type TAdventureForm = {
  adventure?: TAdventure;
  countries: TCountry[];
};

export const AdventureForm: FC<TAdventureForm> = ({ adventure, countries }) => {
  console.log("🚀 ~ file: AdventureForm.tsx:55 ~ adventure:", adventure);
  const locale = useLocale();
  const t = useTranslations("Adventures");

  const [preview, setPreview] = useState<string | null>(
    adventure?.image ? `${imagesApi}/${adventure.image}` : null
  );

  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    arabic_title: z.string().min(1, "Arabic title is required"),
    description: z.string().min(1, "Description is required"),
    arabic_description: z.string().min(1, "Description is required"),
    country_id: z.number(),
    price: z.number().min(0, "Price must be at least 0"),
    start_date: z.date(),
    end_date: z.date(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    gift_points: z.number().min(0, "Gift Points must be at least 0"),
    gender: z.enum(["M", "F", "A"]),
    image: z
      .any()
      // .transform((file) => file.length > 0 && file.item(0))
      .optional(),
    // image: z.any().optional(),
    // image: z.string().optional(),
    add_ons: z.array(
      z.object({
        id: z.number(),
        price: z.number().min(0, "Price must be at least 0"),
      })
    ),
  });

  const defaultStartDate = dayjs(adventure?.startDate).toDate();
  const defaultEndDate = dayjs(adventure?.endDate).toDate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: adventure?.title ?? "",
      arabic_title: adventure?.arabicTitle ?? "",
      description: adventure?.description ?? "",
      arabic_description: adventure?.arabicDescription ?? "",
      country_id: adventure?.countryId ?? 0,
      price: adventure?.price ?? 0,
      start_date: defaultStartDate,
      end_date: defaultEndDate,
      capacity: adventure?.capacity ?? 0,
      gift_points: adventure?.giftPoints ?? 0,
      gender: (adventure?.genderValue ?? "A") as any,
      // image: adventure?.image,
      add_ons: adventure?.addOns ?? [],
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();

      // Append all text-based fields
      formData.append("title", values.title);
      formData.append("arabic_title", values.arabic_title);
      formData.append("description", values.description);
      formData.append("arabic_description", values.arabic_description);
      formData.append("country_id", String(values.country_id));
      formData.append("price", String(values.price));
      formData.append("capacity", String(values.capacity));
      formData.append("gift_points", String(values.gift_points));
      formData.append("gender", values.gender);
      // formData.append("add_ons", values.add_ons); // Assuming this is an array or object
      formData.append("add_ons", JSON.stringify(values.add_ons)); // Assuming this is an array or object
      formData.append("start_date", format(values.start_date, "dd/MM/yyyy"));
      formData.append("end_date", format(values.end_date, "dd/MM/yyyy"));
      if (adventure) {
        formData.append("slug", adventure.slug);
      }

      // Append the image if it exists
      if (values.image) {
        formData.append("image", values.image);
      }

      return fetch(`/api/adventure/update-adventure`, {
        method: "PUT",
        headers: {
          "Accept-Language": locale,
          // "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      // const image: File | null = values.image ?? null;
      // console.log("🚀 ~ file: AdventureForm.tsx:114 ~ image:", image);
      // // const arrayBuffer = await image?.arrayBuffer()
      // const dataToSend = {
      //   title: values.title,
      //   arabic_title: values.arabic_title,
      //   description: values.description,
      //   arabic_description: values.arabic_description,
      //   country_id: values.country_id,
      //   price: values.price,
      //   capacity: values.capacity,
      //   gift_points: values.gift_points,
      //   gender: values.gender,
      //   add_ons: values.add_ons,
      //   start_date: format(values.start_date, "dd/MM/yyyy"),
      //   end_date: format(values.end_date, "dd/MM/yyyy"),
      //   ...(image && { image: image }),
      // };

      // console.log("🚀 ~ file: AdventureForm.tsx:106 ~ dataToSend:", dataToSend);
      // return fetch(`/api/adventure/update-adventure`, {
      //   method: "PUT",
      //   headers: {
      //     "Accept-Language": locale,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     slug: adventure?.slug,
      //     dataToSend: dataToSend,
      //   }),
      // });
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
    console.log(
      "🚀 ~ file: AdventureForm.tsx:139 ~ onSubmit ~ values:",
      values
    );
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 items-end"
      >
        {preview && (
          <div className="w-20 h-20 relative">
            <Image
              src={preview}
              fill
              alt="adventure image"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {preview && <div className="w-20 h-20 relative">{preview}</div>}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("englishTitle")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("englishTitle")}
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
          name="arabic_title"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("arabicTitle")}</FormLabel>
              <FormControl>
                <Input
                  dir="rtl"
                  placeholder={t("arabicTitle")}
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
          name="description"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("description")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("description")}
                  className=" border-primary resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="arabic_description"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("arabicDescription")}</FormLabel>
              <FormControl>
                <Textarea
                  dir="rtl"
                  placeholder={t("arabicDescription")}
                  className=" border-primary resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("country")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between border-primary",
                        !field.value && "text-muted-foreground "
                      )}
                    >
                      {field.value
                        ? countries.find(
                            (country) => country.id === field.value
                          )?.name
                        : t("selectCountry")}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className="flex flex-col max-h-96">
                    <CommandInput placeholder="Search countries..." />
                    <CommandEmpty>{t("noCountryFound")}</CommandEmpty>

                    <CommandList className="flex flex-col">
                      {countries.map((country) => (
                        <CommandItem
                          value={country.name}
                          key={country.id}
                          onSelect={() => {
                            form.setValue("country_id", country.id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              country.id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {country.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
            control={form.control}
            name="country_id"
            render={({ field }) => (
              <FormItem className=" w-full mb-2">
                <FormLabel>{t("country")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="rounded-full border-primary">
                      <SelectValue placeholder={t("selectCountry")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countries.map((country, i) => <SelectItem key={i} value={country.id.toString()}>{`${country.name} - ${country.continent}`}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("price")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("price")}
                  className=" border-primary"
                  {...field}
                  type="number"
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
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
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
                    fromYear={dayjs().subtract(20, "year").year()}
                    toYear={dayjs().add(3, "year").year()}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > dayjs().add(20, "year").toDate() ||
                      date < dayjs().subtract(3, "year").toDate()
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
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
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
                    fromYear={dayjs().subtract(20, "year").year()}
                    toYear={dayjs().add(3, "year").year()}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > dayjs().add(20, "year").toDate() ||
                      date < dayjs().subtract(3, "year").toDate()
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
          name="capacity"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("capacity")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("capacity")}
                  className=" border-primary"
                  {...field}
                  type="number"
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
          name="gift_points"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("giftPoints")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("giftPoints")}
                  className=" border-primary"
                  {...field}
                  type="number"
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
          name="gender"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("gender")}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-full border-primary">
                    <SelectValue placeholder={t("selectGender")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="A">{t("mixed")}</SelectItem>
                  <SelectItem value="M">{t("male")}</SelectItem>
                  <SelectItem value="F">{t("female")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("image")}</FormLabel>
              <FormControl>
                <Input
                  className=" border-primary"
                  {...field}
                  value={undefined}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    console.log(
                      "🚀 ~ file: AdventureForm.tsx:505 ~ file:",
                      file
                    );
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      console.log(
                        "🚀 ~ file: AdventureForm.tsx:508 ~ imageUrl:",
                        imageUrl
                      );

                      setPreview(imageUrl);

                      field.onChange(file);
                    }
                  }}
                  type="file"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full flex justify-center sm:justify-start">
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
      </form>
    </Form>
  );
};
