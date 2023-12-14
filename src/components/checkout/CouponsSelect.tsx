"use client";

import { TCoupon } from "@/lib/types";
import { cn, formatePrice } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";
import React, { FC, useState } from "react";
import { Badge } from "../ui/badge";

type TCouponsSelect = {
  coupons: TCoupon[];
  defaultSelected: TCoupon | null;
  onSelect: (coupon: TCoupon | null) => void;
  applyTo: "adventure" | "consultation";
};

export const CouponsSelect: FC<TCouponsSelect> = ({
  coupons,
  onSelect,
  defaultSelected,
  applyTo,
}) => {
  const [selectedCoupon, setSelectedCoupon] = useState<TCoupon | null>(
    defaultSelected
  );

  const locale = useLocale();

  return (
    <div className="grid gap-3 @container grid-cols-1 @md:grid-cols-2">
      {coupons
        .filter((c) => c.applyTo === applyTo)
        .map((coupon, i) => (
          <div
            key={i}
            className={cn(
              "p-4 rounded-md select-none w-full cursor-pointer min-h-[5rem] bg-background gap-3 text-foreground  flex justify-between border-2 border-border",
              coupon.id === selectedCoupon?.id && "border-secondary"
            )}
            onClick={() => {
              setSelectedCoupon(
                coupon.id === selectedCoupon?.id ? null : coupon
              );
              onSelect(coupon.id === selectedCoupon?.id ? null : coupon);
            }}
          >
            <div className="flex flex-col gap-3 justify-between w-full">
              <div className="w-full">
                <p className="text-sm font-medium break-all">{coupon.code}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {coupon.applyTo}
                </p>
              </div>
              <p className="text-sm font-bold text-secondary">
                {coupon.type === "percentage"
                  ? `${coupon.percentOff}% off`
                  : formatePrice({ locale, price: coupon.value! })}
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
