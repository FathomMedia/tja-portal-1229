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
import { TAchievement } from "@/lib/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageOff } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { MAX_IMAGE_SIZE } from "@/config";
import { useRouter } from "next/navigation";

type TAchievementsForm = {
  achievement?: TAchievement;
};

export const AchievementsForm: FC<TAchievementsForm> = ({ achievement }) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const { push } = useRouter();

  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    arabic_title: z.string().min(1, "Arabic title is required"),
    description: z.string().min(1, "Description is required"),
    arabic_description: z.string().min(1, "Arabic description is required"),
    badge: z
      .any()
      .optional()
      .refine(
        (file) => (file ? file.size <= MAX_IMAGE_SIZE : true),
        `Max file size is 2MB.`
      ),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: achievement?.englishTitle ?? "",
      arabic_title: achievement?.arabicTitle ?? "",
      description: achievement?.englishDescription ?? "",
      arabic_description: achievement?.arabicDescription ?? "",
    },
  });

  const [preview, setPreview] = useState<string | null>(
    achievement?.badge ?? null
  );

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const formData = new FormData();
      // Append all text-based fields
      formData.append("title", values.title.toString());
      formData.append("arabic_title", values.arabic_title.toString());
      formData.append("description", values.description.toString());
      formData.append(
        "arabic_description",
        values.arabic_description.toString()
      );
      values.badge && formData.append("badge", values.badge);
      achievement && formData.append("id", achievement.id.toString());

      return achievement
        ? fetch(`/api/achievement/update-achievement`, {
            method: "PUT",
            headers: {
              "Accept-Language": locale,
            },
            body: formData,
          })
        : fetch(`/api/achievement/new-achievement`, {
            method: "POST",
            headers: {
              "Accept-Language": locale,
            },
            body: formData,
          });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { data: ach, message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/achievements"] });
        if (achievement) {
          queryClient.invalidateQueries({
            queryKey: [`/achievements/${achievement.id}`],
          });
        } else {
          // push to created page
          const newAchievement: TAchievement = ach;
          push(`/${locale}/admin/achievements/edit/${newAchievement.id}`);
        }
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

        <div className="w-full flex justify-center sm:justify-start">
          <Button
            className="w-full max-w-[268px] mt-5"
            variant={"secondary"}
            type="submit"
          >
            {mutation.isPending && (
              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
            )}
            {achievement ? t("update") : t("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
