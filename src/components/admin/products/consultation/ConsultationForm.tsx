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
import { TConsultation } from "@/lib/types";

type TConsultationForm = {
  consultation?: TConsultation;
};

export const ConsultationForm: FC<TConsultationForm> = ({ consultation }) => {
  const locale = useLocale();
  const t = useTranslations("Consultation");
  // const {refresh } = useRouter();
  const formSchema = z.object({
    tier: z.string().min(1, "Please select a tier"),
    numOfDays: z.number().min(1, "Please select the number of days"),
    price: z.number(),
  });

  const [isOpen, setIsOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tier: consultation?.tier ?? undefined,
      numOfDays: consultation?.numberOfDays ?? undefined,
      price: consultation?.price ?? undefined,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return consultation
        ? fetch("/api/consultation/update-consultation", {
            method: "PUT",
            headers: {
              "Accept-Language": locale,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: consultation.id,
              ...values,
            }),
          })
        : fetch("/api/consultation/create-consultation", {
            method: "POST",
            headers: {
              "Accept-Language": locale,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tier: values.tier,
              number_of_days: values.numOfDays,
              price: values.price,
            }),
          });
    },
    async onSuccess(data, values) {
      const { message, data: dataResponse } = await data.json();
      if (data.ok) {
        queryClient.invalidateQueries({ queryKey: ["/consultations"] });
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

  const deleteConsultationMutation = useMutation({
    mutationFn: (values: TConsultation) => {
      console.log(
        "🚀 ~ file: ConsultationForm.tsx:155 ~ values:",
        values.numberOfDays
      );
      return fetch("/api/consultation/delete-consultation", {
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
        queryClient.invalidateQueries({ queryKey: ["/consultations"] });
        toast.success(message, { duration: 6000 });
      } else {
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  async function onDeletePackage(values: TConsultation) {
    deleteConsultationMutation.mutate(values);
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="">
          {consultation ? (
            <Button
              variant={"ghost"}
              size={"sm"}
              className="relative flex cursor-default select-none items-center justify-start text-start rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full"
            >
              {t("edit")}
            </Button>
          ) : (
            <div className="flex flex-col items-center text-blue-500 text-xs gap-1 hover:bg-muted p-1 rounded-sm duration-100">
              <PlusCircle className="w-4 h-4" />
              <DisplayTranslatedText text="add" translation="Consultation" />
            </div>
          )}
        </DialogTrigger>
        <DialogContent>
          {consultation ? (
            <DialogHeader>
              <DialogTitle className=" text-primary text-xl">
                {t("updateAConsultationPackage")}
              </DialogTitle>
              <DialogDescription>
                {t("editAConsultationPackageHere")}
              </DialogDescription>
            </DialogHeader>
          ) : (
            <DialogHeader>
              <DialogTitle className=" text-primary text-xl">
                {t("createAConsultationPackage")}
              </DialogTitle>
              <DialogDescription>
                {t("createAConsultationPackageHere")}
              </DialogDescription>
            </DialogHeader>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-6 flex flex-col items-start w-full mt-4"
            >
              <div className="w-full flex flex-col gap-6 ">
                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem className=" w-full mb-2">
                      <FormLabel className="text-base">
                        {t("packageType")}
                        <span className="text-destructive ms-1">*</span>
                      </FormLabel>
                      <Select
                        dir={isRtlLang(locale) ? "rtl" : "ltr"}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-full border-primary">
                            <SelectValue placeholder={"Select days"} />
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
                <FormField
                  control={form.control}
                  name="numOfDays"
                  render={({ field }) => (
                    <FormItem className=" w-full mb-2">
                      <FormLabel className="text-base">
                        {t("numberOfDays")}
                        <span className="text-destructive ms-1">*</span>
                      </FormLabel>
                      <Select
                        dir={isRtlLang(locale) ? "rtl" : "ltr"}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                        }}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-full border-primary">
                            <SelectValue placeholder={"Select package"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="7">{7}</SelectItem>
                          <SelectItem value="14">{14}</SelectItem>
                          <SelectItem value="21">{21}</SelectItem>
                          <SelectItem value="30">{30}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-base">
                        {t("priceInBHD")}
                        {/* <span className="text-destructive ms-1">*</span> */}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
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

                <div className="w-full flex justify-center items-center">
                  <Button
                    className="w-full max-w-[268px] "
                    variant={"secondary"}
                    type="submit"
                  >
                    {" "}
                    {/* {mutation.isPending && (
                              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                            )} */}
                    {t("saveChanges")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          {consultation && (
            <div className=" w-full flex justify-center mt-4">
              <AlertDialog>
                <AlertDialogTrigger className=" text-xs text-red-500">
                  {t("deletePackage")}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("thisActionCannotBeUndone")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <Button
                      className=" text-sm bg-transparent text-red-400 hover:bg-transparent"
                      onClick={() => onDeletePackage(consultation)}
                    >
                      {t("yesDelete")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
