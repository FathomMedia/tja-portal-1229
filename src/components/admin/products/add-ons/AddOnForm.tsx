"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FC, useState } from "react";
import { TAddon } from "@/lib/types";

type TAddonForm = {
  addOn?: TAddon;
};

export const AddOnForm: FC<TAddonForm> = ({ addOn }) => {
  const locale = useLocale();
  const t = useTranslations("AddOn");
  // const {refresh } = useRouter();
  const formSchema = z.object({
    name: z.string().min(1, "Please fill in this field"),
    arabicName: z.string().min(1, "Please fill in this field"),
  });

  const [isOpen, setIsOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: addOn?.englishName ?? undefined,
      arabicName: addOn?.arabicName ?? undefined,
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return addOn
        ? fetch("/api/add-ons/update-add-on", {
            method: "PUT",
            headers: {
              "Accept-Language": locale,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: addOn.id,
              ...{
                name: values.name,
                arabic_name: values.arabicName,
              },
            }),
          })
        : fetch("/api/add-ons/new-add-on", {
            method: "POST",
            headers: {
              "Accept-Language": locale,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              arabic_name: values.arabicName,
            }),
          });
    },
    async onSuccess(data, values) {
      const { message, data: dataResponse } = await data.json();
      if (data.ok) {
        queryClient.invalidateQueries({ queryKey: ["/add-ons"] });
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

  const deleteAddonMutation = useMutation({
    mutationFn: (values: TAddon) => {
      return fetch("/api/add-ons/delete-add-on", {
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
        queryClient.invalidateQueries({ queryKey: ["/add-ons"] });
        toast.success(message, { duration: 6000 });
      } else {
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  async function onDeleteAddon(values: TAddon) {
    deleteAddonMutation.mutate(values);
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild className="">
          {addOn ? (
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
              <DisplayTranslatedText text="add" translation="AddOn" />
            </div>
          )}
        </DialogTrigger>
        <DialogContent>
          {addOn ? (
            <DialogHeader>
              <DialogTitle className=" text-primary text-xl">
                {/* Update add-on */}
                {t("updateAddOn")}
              </DialogTitle>
              <DialogDescription>
                {/* Edit the add-on details. Click save once you're done. */}
                {t("editAddOn")}
              </DialogDescription>
            </DialogHeader>
          ) : (
            <DialogHeader>
              <DialogTitle className=" text-primary text-xl">
                {/* Create add-on */}
                {t("createAddOn")}
              </DialogTitle>
              <DialogDescription>
                {/* Enter the new add-on details. Click save once you're done. */}
                {t("createAddOnDescription")}
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
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-base">
                        {t("englishName")}
                        <span className="text-destructive ms-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="ltr"
                          placeholder=""
                          className=" border-primary"
                          // dir="rtl"
                          type="text"
                          {...field}
                          // onChange={(event) =>
                          //   field.onChange(Number(event.target.value))
                          // }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arabicName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="text-base">
                        {t("arabicName")}
                        <span className="text-destructive ms-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          dir="rtl"
                          placeholder=""
                          className=" border-primary"
                          type="text"
                          {...field}
                          // onChange={(event) =>
                          //   field.onChange(Number(event.target.value))
                          // }
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
                    {/* {mutation.isPending && (
                              <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                            )} */}
                    {t("saveChanges")}
                    {/* save changes */}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
          {addOn && (
            <div className=" w-full flex justify-center mt-4">
              <AlertDialog>
                <AlertDialogTrigger className=" text-xs text-red-500">
                  {/* Delete add-on? */}
                  {t("deleteAddOn")}
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {/* {This action cannot be undone. This will permanently delete
                    this data.} */}
                      {t("deleteProductDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <Button
                      className=" text-sm bg-transparent text-red-400 hover:bg-transparent"
                      onClick={() => onDeleteAddon(addOn)}
                    >
                      {t("yesDelete")}
                      {/* Yes, delete */}
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
