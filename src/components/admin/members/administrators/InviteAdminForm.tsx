"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { isRtlLang } from "rtl-detect";
import { Input } from "@/components/ui/input";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { TAdminInvitation, TConsultation } from "@/lib/types";

type TInviteAdminForm = {
  adminInvitation?: TAdminInvitation;
};

export const InviteAdminForm: FC<TInviteAdminForm> = ({ adminInvitation }) => {
  const locale = useLocale();
  const t = useTranslations("AdminInvite");
  const formSchema = z.object({
    email: z
      .string()
      .email(t("email.errors.invalid"))
      .min(1, t("email.errors.required")),
    name: z.string().min(2, t("name.errors.required")),
    gender: z.string().min(1).max(1),
  });

  const [isOpen, setIsOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      gender: "",
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return fetch("/api/authentication/invite-admin", {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values }),
      });
    },
    async onSuccess(data, values) {
      const { message, data: dataResponse } = await data.json();
      if (data.ok) {
        queryClient.invalidateQueries({ queryKey: ["/admins/invitations"] });
        toast.success(message, { duration: 6000 });
      } else {
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
    setIsOpen(false);
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="">
          <div className="flex flex-col items-center text-blue-500 text-xs gap-1 hover:bg-muted p-1 rounded-sm duration-100">
            <PlusCircle className="w-4 h-4" />
            <DisplayTranslatedText text="Invite" translation="AdminInvite" />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" text-primary text-xl">
              {t("inviteAnAdmin")}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-6 flex flex-col items-start w-full mt-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("name")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterYourName")}
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
                name="email"
                render={({ field }) => (
                  <FormItem className=" w-full">
                    <FormLabel>{t("emailAddress")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        className=" border-primary"
                        type="email"
                        {...field}
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
                  <FormItem className=" w-full mb-2">
                    <FormLabel>{t("gender")}</FormLabel>
                    <Select
                      dir={isRtlLang(locale) ? "rtl" : "ltr"}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-full border-primary">
                          <SelectValue placeholder={t("selectGender")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">{t("male")}</SelectItem>
                        <SelectItem value="F">{t("female")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full flex justify-center items-center">
                <Button
                  className="w-full max-w-[268px] "
                  variant={"secondary"}
                  type="submit"
                >
                  {t("sendInvite")}
                </Button>
              </div>
              {/* </div> */}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
