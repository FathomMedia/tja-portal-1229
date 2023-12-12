"use client";

import { TAddon, TCoupon } from "@/lib/types";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import React, { FC, useState } from "react";

type TPaymentTypeSelect = {
  defaultSelected: boolean;
  onSelect: (isPartialPayment: boolean) => void;
};

export const PaymentTypeSelect: FC<TPaymentTypeSelect> = ({
  onSelect,
  defaultSelected,
}) => {
  const [isPartialPayment, setIsPartialPayment] =
    useState<boolean>(defaultSelected);

  return (
    <div className="flex gap-3 flex-col @container @sm:flex-row">
      <div
        className={cn(
          "p-4 rounded-md select-none w-full cursor-pointer min-h-[5rem] bg-background gap-3 text-foreground  flex justify-between border-2 border-border",
          isPartialPayment && "border-secondary"
        )}
        onClick={() => {
          setIsPartialPayment(true);
          onSelect(true);
        }}
      >
        <div className="flex flex-col gap-3 justify-between w-full">
          <div>
            <p className="text-sm font-medium whitespace-pre">
              Partial Payment
            </p>
          </div>
          <p className="text-sm font-bold">$$$</p>
        </div>
        {/* select icon */}
        <div className={cn("duration-150 h-fit w-fit")}>
          {isPartialPayment ? (
            <CheckCircle2 className="w-5 h-5  bg-secondary text-secondary-foreground rounded-full" />
          ) : (
            <div className="w-5 h-5 border border-muted-foreground rounded-full" />
          )}
        </div>
      </div>
      <div
        className={cn(
          "p-4 rounded-md select-none w-full cursor-pointer min-h-[5rem] bg-background gap-3 text-foreground  flex justify-between border-2 border-border",
          !isPartialPayment && "border-secondary"
        )}
        onClick={() => {
          setIsPartialPayment(false);
          onSelect(false);
        }}
      >
        <div className="flex flex-col gap-3 justify-between w-full">
          <div>
            <p className="text-sm font-medium whitespace-pre">Full Payment</p>
          </div>
          <p className="text-sm font-bold">$$$$$</p>
        </div>
        {/* select icon */}
        <div className={cn("duration-150 h-fit w-fit")}>
          {!isPartialPayment ? (
            <CheckCircle2 className="w-5 h-5  bg-secondary text-secondary-foreground rounded-full" />
          ) : (
            <div className="w-5 h-5 border border-muted-foreground rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
};
