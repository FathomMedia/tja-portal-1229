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
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/ui/icons";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { TLevel } from "@/lib/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageOff } from "lucide-react";

type TLevelsForm = {
  level?: TLevel;
};

export const LevelsForm: FC<TLevelsForm> = ({ level }) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const formSchema = z
    .object({
      name: z.string().min(1, "Name is required"),
      arabic_name: z.string().min(1, "Arabic name is required"),
      badge: z.any().optional(),
      minDays: z.number().min(1).optional(),
      maxDays: z.number().min(1).optional(),
    })
    .superRefine(({ minDays, maxDays }, ctx) => {
      if ((maxDays ?? 0) <= (minDays ?? 0)) {
        ctx.addIssue({
          code: "custom",
          message: t("maxDaysLow"),
          path: ["maxDays"],
        });
      }
    });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: level?.englishName ?? "",
      arabic_name: level?.arabicName ?? "",
      minDays: level?.minDays ?? 0,
      maxDays: level?.maxDays ?? 0,
    },
  });

  const [preview, setPreview] = useState<string | null>(level?.badge ?? null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();

      // Append all text-based fields
      formData.append("name", values.name);
      formData.append("arabic_name", values.arabic_name);
      formData.append("min_days", (values.minDays ?? 0).toString());
      formData.append("max_days", (values.maxDays ?? 0).toString());
      values.badge && formData.append("badge", values.badge);
      level && formData.append("id", level.id.toString());

      return level
        ? fetch(`/api/level/update-level`, {
            method: "PUT",
            headers: {
              "Accept-Language": locale,
            },
            body: formData,
          })
        : fetch(`/api/level/new-level`, {
            method: "POST",
            headers: {
              "Accept-Language": locale,
            },
            body: formData,
          });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/levels"] });
        level &&
          queryClient.invalidateQueries({
            queryKey: [`/levels/${level.id}`],
          });
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
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 items-end"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("englishName")}</FormLabel>
              <FormControl>
                <Input
                  dir="ltr"
                  placeholder={t("englishName")}
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
          name="arabic_name"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("arabicName")}</FormLabel>
              <FormControl>
                <Input
                  dir="rtl"
                  placeholder={t("arabicName")}
                  className=" border-primary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 items-end">
          <FormField
            control={form.control}
            name="badge"
            render={({ field }) => (
              <FormItem className=" w-full">
                <FormLabel>{t("badge")}</FormLabel>
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
          name="minDays"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("minDays")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("minDays")}
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
          name="maxDays"
          render={({ field }) => (
            <FormItem className=" w-full">
              <FormLabel>{t("maxDays")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("maxDays")}
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

        <div className="w-full flex justify-center sm:justify-start">
          <Button
            className="w-full max-w-[268px] mt-5"
            variant={"secondary"}
            type="submit"
          >
            {mutation.isPending && (
              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
            )}
            {level ? t("update") : t("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
