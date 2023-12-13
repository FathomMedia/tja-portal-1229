"use client";

import { TCoupon } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";
import React, { FC, useState } from "react";

type TCouponsSelect = {
  coupons: TCoupon[];
  defaultSelected: TCoupon | undefined;
  onSelect: (coupon: TCoupon | undefined) => void;
  applyTo: "adventure" | "consultation";
};

export const CouponsSelect: FC<TCouponsSelect> = ({
  coupons,
  onSelect,
  defaultSelected,
  applyTo,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupon | undefined>(
    defaultSelected
  );

  const locale = useLocale();

  return (
    <div className="flex gap-3 overflow-x-scroll">
      {coupons
        .filter((c) => c.applyTo === applyTo)
        .map((coupon, i) => (
          <div
            key={i}
            className={cn(
              "p-4 rounded-md select-none min-w-[15rem] cursor-pointer min-h-[5rem] bg-background gap-3 text-foreground  flex justify-between border-2 border-border",
              coupon.id === selectedCoupon?.id && "border-secondary"
            )}
            onClick={() => {
              setSelectedCoupon(
                coupon.id === selectedCoupon?.id ? undefined : coupon
              );
              onSelect(coupon.id === selectedCoupon?.id ? undefined : coupon);
            }}
          >
            <div className="flex flex-col gap-3 justify-between w-full">
              <div>
                <p className="text-sm font-medium whitespace-pre">
                  {coupon.code}
                </p>
              </div>
              <p className="text-sm font-bold text-secondary">
                {coupon.type === "percentage"
                  ? `${coupon.percentOff}% off`
                  : Intl.NumberFormat(locale, {
                      currency: "BHD",
                      style: "currency",
                    }).format(coupon.value!)}
              </p>
            </div>
            {/* select icon */}
            <div className={cn("duration-150 h-fit w-fit")}>
              {coupon.id === selectedCoupon?.id ? (
                <CheckCircle2 className="w-5 h-5  bg-secondary text-secondary-foreground rounded-full" />
              ) : (
                <div className="w-5 h-5 border border-muted-foreground rounded-full" />
              )}
            </div>
          </div>
        ))}
    </div>
  );
};
