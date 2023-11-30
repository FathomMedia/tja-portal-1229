"use client";

import React, { useState } from "react";
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
import { useSearchParams } from "next/navigation";
import OtpInput from "react-otp-input";
import { Label } from "@/components/ui/label";

export default function Page() {
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOTPSent, setOTPSent] = useState<boolean>(false);

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
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }
  return (
    <div>
      <div className="container max-w-md flex flex-col items-center py-6  md:py-20">
        <Form {...formOTP}>
          <form
            onSubmit={formOTP.handleSubmit(onSubmitOTP)}
            className="space-y-8 flex flex-col items-center"
          >
            <div className="w-full flex flex-col gap-2">
              <Label className="w-full">An email is sent to</Label>
              <Input
                disabled
                value={searchParams.get("email") ?? "undefined"}
              />
            </div>
            <FormField
              control={formOTP.control}
              name="otp"
              render={({ field }) => (
                <FormItem className=" w-full">
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    {/* <Input
                    placeholder="OTP sent to the above email"
                    className=" border-primary"
                    type="text"
                    {...field}
                  /> */}
                    <OtpInput
                      containerStyle={{
                        width: "100%",
                      }}
                      value={field.value}
                      onChange={field.onChange}
                      numInputs={6}
                      renderSeparator={<span className="w-2"></span>}
                      renderInput={(props) => (
                        <Input
                          {...props}
                          className=" rounded-md !w-12 h-"
                          type="text"
                        />
                      )}
                      inputType="number"
                      shouldAutoFocus={true}
                      inputStyle={
                        {
                          // border: "1px solid transparent",
                          // borderRadius: "8px",
                          // width: "54px",
                          // height: "54px",
                          // fontSize: "12px",
                          // color: "#000",
                          // fontWeight: "400",
                          // caretColor: "blue",
                        }
                      }

                      // focusStyle={{
                      //   border: "1px solid #CFD3DB",
                      //   outline: "none"
                      // }}
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
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
