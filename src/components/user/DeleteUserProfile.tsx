"use client";
import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../ui/form";
import { Icons } from "../ui/icons";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {} from "@radix-ui/react-dialog";

export const DeleteProfile = () => {
  const t = useTranslations("DeleteProfile");
  const { refresh } = useRouter();

  const formSchema = z.object({
    password: z.string().min(8, t("password.errors.required")),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const locale = useLocale();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);

    // TODO: move this to api route and set the token in the cookies
    const res = await fetch(`/api/user/delete-user-profile`, {
      method: "POST",
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: values.password,
      }),
    }).finally(() => {
      setIsLoading(false);
    });

    const { data, message } = await res.json();
    console.log("🚀 ~ file: DeleteUserProfile.tsx:71 ~ onSubmit ~ data:", data);

    if (res.ok) {
      toast.success(message, { duration: 6000 });
      refresh();
    } else {
      toast.error(message);
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger className=" underline text-muted-foreground text-sm italic">
          {t("deleteAccount")}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" my-4">
              <h2 className=" text-primary font-semibold ">
                {t("areYouSure?")}
              </h2>
            </DialogTitle>
            <DialogDescription>
              <p>{t("typePasswordToConfirmDeletingAccount")}</p>
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" w-full grid grid-cols-1 sm:grid-cols-2 justify-center items-end gap-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("password")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("password")}
                        className=" border-primary"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <div className="w-full flex justify-center sm:justify-end">
                  <Button
                    className="w-full max-w-[268px] mt-5"
                    variant={"secondary"}
                    type="submit"
                  >
                    {isLoading && (
                      <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                    )}
                    {t("deleteMyAccount")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          <DialogFooter>
            <DialogClose className=" text-sm text-muted-foreground mt-4">
              {t("cancel")}
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
