"use client";

import { TAddon } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { useLocale } from "next-intl";
import React, { FC, useState } from "react";

type TAddonsSelect = {
  addons: TAddon[];
  defaultSelected: TAddon[];
  onSelect: (addons: TAddon[]) => void;
};

export const AddonsSelect: FC<TAddonsSelect> = ({
  addons,
  onSelect,
  defaultSelected,
}) => {
  const [selectedAddons, setSelectedAddons] =
    useState<TAddon[]>(defaultSelected);
  const locale = useLocale();

  return (
    <div className="flex gap-3 overflow-x-scroll">
      {addons.map((add, i) => (
        <div
          key={i}
          className={cn(
            "p-4 rounded-md select-none min-w-[15rem] cursor-pointer min-h-[5rem] bg-background gap-3 text-foreground  flex justify-between border-2 border-border",
            selectedAddons.some((addon) => addon.id === add.id) &&
              "border-secondary"
          )}
          onClick={() => {
            const temp = selectedAddons.some((addon) => addon.id === add.id)
              ? selectedAddons.filter((addon) => addon.id !== add.id)
              : [...selectedAddons, add];
            setSelectedAddons(temp);
            onSelect(temp);
          }}
        >
          <div className="flex flex-col gap-3 justify-between">
            <div>
              <p className="text-sm font-medium">{add.title}</p>
            </div>
            <p className="text-sm font-bold text-secondary">
              {Intl.NumberFormat(locale, {
                currency: "BHD",
                style: "currency",
              }).format(add.price)}
            </p>
          </div>
          {/* select icon */}
          <div className={cn("duration-150 h-fit")}>
            {selectedAddons.some((addon) => addon.id === add.id) ? (
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
