"use client";

import React, { FC, useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { cn, parseDateFromAPI } from "@/lib/utils";
import { format } from "date-fns";
import dayjs from "dayjs";
import { Check, ChevronsUpDown, ClipboardCopy, ImageOff } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { TAddon, TAdventure, TCountry } from "@/lib/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { MAX_ADMIN_FILE_SIZE, MAX_IMAGE_SIZE } from "@/config";
import { useRouter } from "next/navigation";

type TAdventureForm = {
  adventure?: TAdventure;
  countries: TCountry[];
  addons: TAddon[];
};

export const AdventureForm: FC<TAdventureForm> = ({
  adventure,
  countries,
  addons,
}) => {
  const locale = useLocale();
  const t = useTranslations("Adventures");
  const { push } = useRouter();

  const [preview, setPreview] = useState<string | null>(
    adventure?.image ?? null
  );

  const formSchema = z.object({
    link: z
      .string()
      .url("Link is invalid")
      .min(1, "Wordpress link is required"),
    feedbackForm: z.string().url("Link is invalid").optional(),
    title: z.string().min(1, "Title is required"),
    arabic_title: z.string().min(1, "Arabic title is required"),
    description: z.string().min(1, "Description is required"),
    arabic_description: z.string().min(1, "Description is required"),
    country_id: z.number(),
    price: z.number().positive().min(0.01, "Price must be at least 0.01"),
    // start_date: z.date(),
    // end_date: z.date(),
    dateRange: z.object({
      from: z.date(),
      to: z.date(),
    }),
    capacity: z.number().min(0, "Capacity must be at least 0"),
    gift_points: z.number().min(0, "Gift Points must be at least 0"),
    gender: z.enum(["M", "F", "A"]),
    image: z
      .any()
      .optional()
      .refine(
        (file) => (file ? file.size <= MAX_IMAGE_SIZE : true),
        `Max file size is 2MB.`
      ),
    travel_guide: z
      .any()
      .optional()
      .refine(
        (file) => (file ? file.size <= MAX_ADMIN_FILE_SIZE : true),
        `Max file size is 10MB.`
      ),
    fitness_guide: z
      .any()
      .optional()
      .refine(
        (file) => (file ? file.size <= MAX_ADMIN_FILE_SIZE : true),
        `Max file size is 10MB.`
      ),
    packing_list: z
      .any()
      .optional()
      .refine(
        (file) => (file ? file.size <= MAX_ADMIN_FILE_SIZE : true),
        `Max file size is 10MB.`
      ),
    add_ons: z.array(
      z.object({
        id: z.number(),
        price: z.number().min(0, "Price must be at least 0"),
      })
    ),
  });

  const defaultStartDate = adventure
    ? parseDateFromAPI(adventure.startDate)
    : new Date();
  const defaultEndDate = adventure
    ? parseDateFromAPI(adventure.endDate)
    : new Date();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: adventure?.link ?? "",
      feedbackForm: adventure?.feedbackForm ?? undefined,
      title: adventure?.englishTitle ?? "",
      arabic_title: adventure?.arabicTitle ?? "",
      description: adventure?.englishDescription ?? "",
      arabic_description: adventure?.arabicDescription ?? "",
      country_id: adventure?.countryId ?? 0,
      price: adventure?.price ?? undefined,
      dateRange: {
        from: defaultStartDate,
        to: defaultEndDate,
      },
      capacity: adventure?.capacity ?? undefined,
      gift_points: adventure?.giftPoints ?? undefined,
      gender: (adventure?.genderValue ?? "A") as any,
      add_ons: adventure?.addOns ?? [],
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();

      // Append all text-based fields
      formData.append("link", values.link);
      values.feedbackForm &&
        formData.append("feedback_form", values.feedbackForm);
      formData.append("title", values.title);
      formData.append("arabic_title", values.arabic_title);
      formData.append("description", values.description);
      formData.append("arabic_description", values.arabic_description);
      formData.append("country_id", String(values.country_id));
      formData.append("price", String(values.price));
      formData.append("capacity", String(values.capacity));
      formData.append("gift_points", String(values.gift_points));
      formData.append("gender", values.gender);
      formData.append("add_ons", JSON.stringify(values.add_ons));
      formData.append(
        "start_date",
        format(values.dateRange.from, "dd/MM/yyyy")
      );
      formData.append("end_date", format(values.dateRange.to, "dd/MM/yyyy"));
      if (adventure) {
        formData.append("slug", adventure.slug);
        formData.append("_method", "PUT");
      }

      // Append the files if exists
      if (values.image) {
        formData.append("image", values.image);
      }
      if (values.fitness_guide) {
        formData.append("fitness_guide", values.fitness_guide);
      }
      if (values.travel_guide) {
        formData.append("travel_guide", values.travel_guide);
      }
      if (values.packing_list) {
        formData.append("packing_list", values.packing_list);
      }

      const userToken = await fetch("/api/user/get-current-user-token", {
        method: "GET",
      });

      const token = await userToken.json();

      return adventure
        ? fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/adventures/${adventure.slug}`,
            {
              method: "POST",
              headers: {
                "Accept-Language": locale,
                Accept: "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
              },
              body: formData,
            }
          )
        : fetch(`${process.env.NEXT_PUBLIC_API_URL}/adventures`, {
            method: "POST",
            headers: {
              "Accept-Language": locale,
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
          });

      // return adventure
      //   ? fetch(`/api/adventure/update-adventure`, {
      //       method: "PUT",
      //       headers: {
      //         "Accept-Language": locale,
      //       },
      //       body: formData,
      //     })
      //   : fetch(`/api/adventure/new-adventure`, {
      //       method: "POST",
      //       headers: {
      //         "Accept-Language": locale,
      //       },
      //       body: formData,
      //     });
    },
    async onSuccess(res) {
      if (res.ok) {
        const { message, data } = await res.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/adventures"] });
        adventure &&
          queryClient.invalidateQueries({
            queryKey: [`/adventures/${adventure.slug}`],
          });
        if (adventure === undefined) {
          push(`/${locale}/admin/products/adventures/edit/${data.slug}`);
        }
      } else {
        const { message } = await res.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 items-end"
      >
        {preview && (
          <div className="w-40 h-40 relative sm:col-span-2">
            <Image
              src={preview}
              width={160}
              height={160}
              alt="adventure image"
              className="w-full h-full rounded-md shadow-md object-cover"
            />
          </div>
        )}
        {adventure && adventure.slug && (
          <div className="flex">
            <CopyValue title={t("slug")} value={adventure.slug} />
          </div>
        )}
        {adventure && adventure.slug && (
          <div className="flex">
            <CopyValue
              title={t("portalLink")}
              value={`https://portal.thejourneyadventures.com/${locale}/dashboard/checkout/adventures/${adventure.slug}`}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("wordpressLink")}</FormLabel>
              <FormControl>
                <Input
                  dir="ltr"
                  placeholder={t("wordpressLink")}
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
          name="feedbackForm"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("feedbackFormLink")}</FormLabel>
              <FormControl>
                <Input
                  dir="ltr"
                  placeholder={t("feedbackFormLink")}
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
          name="title"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("englishTitle")}</FormLabel>
              <FormControl>
                <Input
                  dir="ltr"
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
              <FormLabel>{t("englishDescription")}</FormLabel>
              <FormControl>
                <Textarea
                  dir="ltr"
                  placeholder={t("englishDescription")}
                  className=" border-primary rounded-3xl resize-none min-h-[10rem]"
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
                  className=" border-primary rounded-3xl resize-none min-h-[10rem]"
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
          name="dateRange"
          render={({ field }) => (
            <FormItem className=" w-full sm:col-span-2 @container">
              <FormLabel>{t("travelDuration")}</FormLabel>
              <FormControl>
                <Calendar
                  defaultMonth={field.value.from}
                  className="w-fit  p-3 rounded-3xl border-primary border"
                  mode="range"
                  selected={field.value}
                  onSelect={(r) => field.onChange(r)}
                  numberOfMonths={2}
                />
              </FormControl>
              <FormMessage />
              <div className="mt-2 w-full text-muted-foreground text-sm flex items-center @md:flex-row flex-col gap-3">
                <p>{dayjs(field.value.from).format("DD/MM/YYYY")}</p>
                <p className="hidden @md:inline-block">{"->"}</p>
                <p>{dayjs(field.value.to).format("DD/MM/YYYY")}</p>
              </div>
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
                  <SelectItem value="M">{t("maleOnly")}</SelectItem>
                  <SelectItem value="F">{t("ladiesOnly")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 items-end">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("image")}</FormLabel>
                <FormControl>
                  <Input
                    dir="ltr"
                    className=" border-primary"
                    {...field}
                    value={undefined}
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        const imageUrl = URL.createObjectURL(file);

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

          <Avatar className="w-10 h-10">
            {preview && <AvatarImage className="object-cover" src={preview} />}
            <AvatarFallback>
              {<ImageOff className="w-4 h-4 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
        </div>
        <FormField
          control={form.control}
          name="add_ons"
          render={({ fieldState }) => (
            <FormItem className="sm:col-span-2">
              <div className="mb-4">
                <FormLabel className="text-base">{t("addons")}</FormLabel>
                <FormDescription>
                  {t("selectTheAddonsYouWantForThisAdventure")}
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addons.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="add_ons"
                    render={({ field }) => (
                      <FormItem
                        key={item.id}
                        className="flex flex-col p-3 bg-muted/30 border rounded-2xl"
                      >
                        <div className="flex gap-4 items-center justify-between">
                          <div className="flex flex-row items-center gap-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value
                                  ?.map((item) => item.id)
                                  .includes(item.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([
                                        ...field.value,
                                        {
                                          id: item.id,
                                          price:
                                            adventure?.addOns.find(
                                              (add) => add.id === item.id
                                            )?.price ?? 0,
                                        },
                                      ])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value.id !== item.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {item.name ?? "NO NAME"}
                            </FormLabel>
                          </div>
                          <div className="flex items-center gap-2">
                            <FormLabel
                              className={cn(
                                "font-normal",
                                !field.value
                                  ?.map((item) => item.id)
                                  .includes(item.id) && "opacity-30"
                              )}
                            >
                              {t("price")}
                            </FormLabel>

                            <Input
                              className="max-w-[8rem]"
                              placeholder="Price"
                              prefix="BHD"
                              disabled={
                                !field.value
                                  ?.map((item) => item.id)
                                  .includes(item.id)
                              }
                              type="number"
                              value={
                                field.value?.find(
                                  (value) => value.id === item.id
                                )?.price ?? 0
                              }
                              onChange={(event) => {
                                const current = field.value?.find(
                                  (value) => value.id === item.id
                                );

                                if (current) {
                                  const temp = {
                                    id: current.id,
                                    price: Number(event.target.value),
                                  };

                                  const withoutTheOld = field.value?.filter(
                                    (value) => value.id !== item.id
                                  );

                                  field.onChange([...withoutTheOld, temp]);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <div className="text-sm flex flex-col gap-1 font-medium text-destructive">
                {(fieldState.error as any)?.map(
                  (
                    err: {
                      price: {
                        message:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | React.PromiseLikeOfReactNode
                          | null
                          | undefined;
                      };
                    },
                    i: React.Key | null | undefined
                  ) => err && <p key={i}>{err.price.message}</p>
                )}
              </div>
            </FormItem>
          )}
        />

        <div className="sm:col-span-2">
          <h2 className="font-black text-primary text-2xl mb-4">
            {t("documents")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex gap-3 items-end bg-muted/30 rounded-2xl border p-3">
              <FormField
                control={form.control}
                name="travel_guide"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        {t("travel_guide")}{" "}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      {adventure?.travelGuide && (
                        <Link
                          href={adventure?.travelGuide}
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: "info", size: "xs" })
                          )}
                        >
                          {t("view")}
                        </Link>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        dir="ltr"
                        className=" border-primary"
                        {...field}
                        value={undefined}
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
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
            </div>
            <div className="flex gap-3 items-end bg-muted/30 rounded-2xl border p-3">
              <FormField
                control={form.control}
                name="fitness_guide"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <div className="flex items-center justify-between">
                      <FormLabel>{t("fitness_guide")}</FormLabel>
                      {adventure?.fitnessGuide && (
                        <Link
                          href={adventure?.fitnessGuide}
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: "info", size: "xs" })
                          )}
                        >
                          {t("view")}
                        </Link>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        dir="ltr"
                        className=" border-primary"
                        {...field}
                        value={undefined}
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
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
            </div>

            <div className="flex gap-3 items-end bg-muted/30 rounded-2xl border p-3">
              <FormField
                control={form.control}
                name="packing_list"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <div className="flex justify-between items-center">
                      <FormLabel>{t("packing_list")}</FormLabel>{" "}
                      {adventure?.packingList && (
                        <Link
                          href={adventure?.packingList}
                          target="_blank"
                          className={cn(
                            buttonVariants({ variant: "info", size: "xs" })
                          )}
                        >
                          {t("view")}
                        </Link>
                      )}
                    </div>
                    <FormControl>
                      <Input
                        dir="ltr"
                        className=" border-primary"
                        {...field}
                        value={undefined}
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
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
            </div>
          </div>
        </div>

        <div className="w-full flex justify-center sm:justify-start">
          <Button
            className="w-full max-w-[268px] mt-5"
            variant={"secondary"}
            type="submit"
          >
            {mutation.isPending && (
              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
            )}
            {adventure ? t("update") : t("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const CopyValue = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className="flex flex-col gap-2  overflow-ellipsis w-full">
      <p className="font-medium text-sm">{title}</p>
      <Button
        variant={"outline"}
        size={"sm"}
        type="button"
        className="flex items-center overflow-x-scroll justify-start gap-1 text-xs w-full hover:cursor-copy group"
        onClick={() => {
          toast.message(`${title} copied to your clipboard.`, {
            icon: <ClipboardCopy className="w-3 h-3" />,
          });
          navigator.clipboard.writeText(value);
        }}
      >
        {value}
        <span>
          <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
        </span>
      </Button>
    </div>
  );
};
