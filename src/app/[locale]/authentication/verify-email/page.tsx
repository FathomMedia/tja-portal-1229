"use client";

import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { TUser } from "@/lib/types";
import ResendButton from "@/components/ResendButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function Page() {
  const locale = useLocale();
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");

  const t = useTranslations("Auth");

  useEffect(() => {
    async function getUser({ locale }: { locale: string }) {
      const res = await fetch("/api/user/get-user-nt", {
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const { data } = await res.json();
      const user: TUser = data;
      return user;
    }
    getUser({ locale }).then((user) => {
      setEmail(user.email);
    });

    return () => {};
  }, [locale]);

  const formSchemaOTP = z.object({
    otp: z.string().min(6).max(6),
  });

  const formOTP = useForm<z.infer<typeof formSchemaOTP>>({
    resolver: zodResolver(formSchemaOTP),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmitOTP(values: z.infer<typeof formSchemaOTP>) {
    setIsLoading(true);
    const response = await fetch(`/api/authentication/verify-email`, {
      method: "POST",
      headers: {
        "Accept-Language": locale,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otp: values.otp,
      }),
    }).finally(() => {
      setIsLoading(false);
    });
    const { message } = await response.json();
    if (response.ok) {
      toast.success(message);
      push(`/${locale}`);
    } else {
      toast.error(message);
    }
  }

  const resendMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/authentication/resend-verify-email`, {
        method: "POST",
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message);
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  const handleResendClick = () => {
    resendMutation.mutate();
  };

  async function logOut() {
    const res = await fetch("/api/authentication/logout", {
      headers: {
        "Accept-Language": locale,
      },
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      queryClient.invalidateQueries();
      push(`/${locale}/authentication`);
    } else {
      toast.error(data.message);
    }
  }

  return (
    <div>
      <div className="p-2">
        <Button
          variant={"ghost"}
          className="text-muted-foreground"
          onClick={logOut}
        >
          {t("logout")}
        </Button>
      </div>
      <div className="container max-w-md flex flex-col items-center py-6  md:py-20">
        <Form {...formOTP}>
          <form
            onSubmit={formOTP.handleSubmit(onSubmitOTP)}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="w-full flex flex-col gap-2">
              <Label className="w-full">{t("emailIsSentTo")}</Label>
              <Input dir="ltr" disabled value={email} />
            </div>
            <FormField
              control={formOTP.control}
              name="otp"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel className="flex items-center justify-between">
                    <p>{t("OTP")}</p>{" "}
                    <ResendButton handleClick={handleResendClick} />
                  </FormLabel>
                  <FormControl>
                    <OtpInput
                      containerStyle={{
                        direction: "ltr",
                        width: "100%",
                      }}
                      value={field.value}
                      onChange={field.onChange}
                      numInputs={6}
                      renderSeparator={<span className="w-2"></span>}
                      renderInput={(props) => (
                        <Input
                          {...props}
                          className=" rounded-md !w-12 !h-12"
                          type="text"
                        />
                      )}
                      inputType="number"
                      shouldAutoFocus={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full max-w-[268px]"
              variant={"secondary"}
              type="submit"
            >
              {isLoading && (
                <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
              )}
              {t("submit")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
