"use client";
import React, { FC, use } from "react";
import { DashboardSection } from "@/components/DashboardSection";

import { useLocale, useTranslations } from "next-intl";

import { TCoupon, TLevel, TUser } from "@/lib/types";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatePrice } from "@/lib/utils";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Copy } from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";

type TJourneysMiles = {
  user: TUser;
  levels: TLevel[];
  coupons: {
    available: TCoupon[];
    redeemed: TCoupon[];
  };
};

export const JourneysMiles: FC<TJourneysMiles> = ({
  user,
  levels,
  coupons,
}) => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  return (
    <DashboardSection
      className="flex flex-col gap-4"
      title={t("journeysMiles")}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
          <p className="text-sm">{t("availablePoints")}</p>
          <p className="text-xl">{user?.points}</p>
        </div>
        {/* <div className="p-4 flex flex-col gap-2 rounded-lg border border-muted">
          <p>{user?.points}</p>
        </div> */}
        <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
          <div className="flex gap-4 items-center">
            <div className="relative aspect-square w-14 min-w-fit ">
              {user?.level.badge && (
                <Image
                  className="w-full h-full object-cover rounded-full"
                  fill
                  src={user?.level.badge}
                  alt="Badge"
                />
              )}
            </div>
            <div className="flex flex-col">
              <p className="w-full text-sm text-primary">{t("level")}</p>
              <p className="w-full text-sm text-muted-foreground">
                {user?.level.name}
              </p>
            </div>
          </div>
        </div>
      </div>
      <LevelsTable levels={levels} userLevelId={user.level.id} />
      <Separator className="bg-muted/50 col-span-2" />
      <RedeemedCoupons coupons={coupons.redeemed} />
      <Separator className="bg-muted/50 col-span-2" />
      <AvailableCoupons coupons={coupons.available} />
    </DashboardSection>
  );
};

const LevelsTable = ({
  levels,
  userLevelId,
}: {
  levels: TLevel[];
  userLevelId: number;
}) => {
  const t = useTranslations("Dashboard");

  return (
    <Table className="bg-card rounded-2xl overflow-clip">
      <TableCaption>{t("theJourneyMilesLevels")}</TableCaption>
      <TableHeader>
        <TableRow className="hover:bg-card">
          <TableHead className="w-fit text-start text-primary">
            {t("level")}
          </TableHead>
          <TableHead className=" text-center text-primary">
            {t("minimumDays")}
          </TableHead>
          <TableHead className=" text-center text-primary">
            {t("maximumDays")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {levels.map((level, i) => (
          <TableRow
            key={i}
            className={cn(
              level.id === userLevelId &&
                "bg-primary text-primary-foreground hover:bg-primary/80"
            )}
          >
            <TableCell className="font-medium">{level.name}</TableCell>
            <TableCell className="text-center">{level.minDays}</TableCell>
            <TableCell className="text-center">{level.maxDays}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const RedeemedCoupons = ({ coupons }: { coupons: TCoupon[] }) => {
  const locale = useLocale();
  return (
    <div className="@container flex flex-col gap-4">
      <h3 className="font-bold md:text-2xl text-xl text-primary">
        My Redeemed Coupons
      </h3>
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4">
        {coupons.map((coupon, i) => (
          <div
            key={i}
            className={cn(
              "p-4 rounded-md w-full min-h-[5rem] bg-background gap-3 text-foreground flex justify-between border-2 border-border"
            )}
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
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="p-3 min-h-[5rem] flex justify-center items-center bg-muted rounded-md text-muted-foreground">
            <p className="text-sm">{"You don't have any redeemed coupons"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
const AvailableCoupons = ({ coupons }: { coupons: TCoupon[] }) => {
  const locale = useLocale();
  return (
    <div className="@container flex flex-col gap-4">
      <h3 className="font-bold md:text-2xl text-xl text-primary">
        Available Coupons
      </h3>
      <div className="grid grid-cols-1 gap-3 @md:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4">
        {coupons.map((coupon, i) => (
          <div
            key={i}
            className={cn(
              "p-4 rounded-md w-full min-h-[5rem] bg-background gap-3 text-foreground flex justify-between border-2 border-border"
            )}
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
              {/* Redeem confirmation */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Redeem</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader className="gap-1">
                    <DialogTitle>Redeem Coupon</DialogTitle>
                    <DialogDescription>
                      {coupon.applyTo === "adventure" ? (
                        <>
                          {"Redeeming this coupon will send you points back to"}{" "}
                          <Badge variant={"outline"}>70 points</Badge>
                        </>
                      ) : (
                        "Redeeming this coupon will not affect your points!"
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div
                    key={i}
                    className={cn(
                      "p-4 rounded-md w-full min-h-[5rem] bg-background gap-3 text-foreground flex justify-between border-2 border-border"
                    )}
                  >
                    <div className="flex flex-col gap-3 justify-between w-full">
                      <div className="w-full">
                        <p className="text-sm font-medium break-all">
                          {coupon.code}
                        </p>
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
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost">
                        Close
                      </Button>
                    </DialogClose>
                    <Button type="button" variant="secondary">
                      Redeem
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
        {coupons.length === 0 && (
          <div className="p-3 min-h-[5rem] flex justify-center items-center bg-muted rounded-md text-muted-foreground">
            <p className="text-sm">{"No available coupons to redeem"}</p>
          </div>
        )}
      </div>
    </div>
  );
};
