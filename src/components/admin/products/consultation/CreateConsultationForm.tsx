"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Badge } from "@/components/ui/badge";
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
import { isRtlLang } from "rtl-detect";
import { Input } from "@/components/ui/input";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";

type TCreateConsultationForm = {
  tier: string;
  numOfDays: number;
  price: number;
};
export const CreateConsultationForm: FC<TCreateConsultationForm> = () => {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  const formSchema = z.object({
    tier: z.string().min(1, "Please select a tier"),
    numOfDays: z.number(),
    price: z.number(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //TODO take the values of the consultation package
    },
  });

  // const queryClient = useQueryClient();
  // const mutation = useMutation({
  //   mutationFn: (values: z.infer<typeof formSchema>) => {
  //     return fetch("/api/consultation", {
  //       method: "POST",
  //       headers: {
  //         "Accept-Language": locale,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         tier: values.package,
  //         start_date: format(values.start_date, "dd/MM/yyyy"),
  //         end_date: format(values.end_date, "dd/MM/yyyy"),
  //       }),
  //     });
  //   },
  //   async onSuccess(data, values) {
  //     const { message, data: dataResponse } = await data.json();
  //     if (data.ok) {
  //       console.log(
  //         "🚀 ~ file: CalculateConsultation.tsx:95 ~ onSuccess ~ dataResponse:",
  //         dataResponse
  //       );
  //       toast.success(message, { duration: 6000 });
  //       onPackageChanged(dataResponse);
  //       startDate(values.start_date);
  //       endDate(values.end_date);
  //       setTotalFullPrice(dataResponse.priceWithCurrency ?? null);
  //     } else {
  //       toast.error(message, { duration: 6000 });
  //     }
  //   },
  //   async onError(error) {
  //     toast.error(error.message, { duration: 6000 });
  //   },
  // });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // mutation.mutate(values);
    console.log(values);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-6 flex flex-col items-start w-full"
        >
          <div className="w-full flex flex-col gap-6 ">
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem className=" w-full mb-2">
                  <FormLabel className="text-base">
                    {"Package Type"}
                    {/* <span className="text-destructive ms-1">*</span> */}
                  </FormLabel>
                  <Select
                    dir={isRtlLang(locale) ? "rtl" : "ltr"}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded-full border-primary">
                        <SelectValue placeholder={"Select package"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="silver">{t("silver")}</SelectItem>
                      <SelectItem value="gold">{t("gold")}</SelectItem>
                      <SelectItem value="platinum">{t("platinum")}</SelectItem>
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
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-base">
                    {t("numOfDays")}
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
                {"Save changes"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      <div className=" w-full flex justify-center mt-4">
        <p className=" text-sm">Delete package?</p>
      </div>
    </div>
  );
};
