"use client";
import React, { FC, useState } from "react";
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

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import toast from "react-hot-toast";
import { Icons } from "../ui/icons";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

export const JourneysMiles: FC = () => {
  const locale = useLocale();
  const t = useTranslations("Dashboard");

  const { data: user, isFetching: isFetchingUser } = useQuery<TUser>({
    queryKey: ["/users/profile"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/users/profile", locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
  });

  const { data: levels, isFetching: isFetchingLevels } = useQuery<TLevel[]>({
    queryKey: ["/levels"],
    queryFn: () =>
      apiReqQuery({ endpoint: "/levels", locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
  });

  const { data: availableCoupons, isFetching: isFetchingAvailableCoupons } =
    useQuery<TCoupon[]>({
      queryKey: ["/profile/coupons/available"],
      queryFn: () =>
        apiReqQuery({ endpoint: "/profile/coupons/available", locale }).then(
          (res) => res.json().then((resData) => resData.data)
        ),
    });

  const { data: redeemedCoupons, isFetching: isFetchingRedeemedCoupons } =
    useQuery<TCoupon[]>({
      queryKey: ["/profile/coupons/redeemed"],
      queryFn: () =>
        apiReqQuery({ endpoint: "/profile/coupons/redeemed", locale }).then(
          (res) => res.json().then((resData) => resData.data)
        ),
    });

  return (
    <DashboardSection
      className="flex flex-col gap-4"
      title={t("journeysMiles")}
    >
      {isFetchingUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="w-full h-20" />
          <Skeleton className="w-full h-20" />
        </div>
      )}
      {!isFetchingUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
            <p className="text-sm">{t("availablePoints")}</p>
            <p className="text-xl">{user?.points}</p>
          </div>
          <div className="p-4 text-primary flex flex-col gap-2 rounded-lg border border-muted">
            {
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
            }
          </div>
        </div>
      )}
      {(isFetchingLevels || isFetchingUser) && (
        <Skeleton className="w-full h-96" />
      )}
      {levels && user && !isFetchingLevels && !isFetchingUser && (
        <LevelsTable levels={levels} userLevelId={user.level.id} />
      )}
      <Separator className="bg-muted/50 col-span-2" />
      {isFetchingRedeemedCoupons && (
        <div className="flex gap-4">
          <Skeleton className="w-full h-20 max-w-xs" />
          <Skeleton className="w-full h-20 max-w-xs" />
        </div>
      )}
      {redeemedCoupons && !isFetchingRedeemedCoupons && (
        <RedeemedCoupons coupons={redeemedCoupons} />
      )}
      <Separator className="bg-muted/50 col-span-2" />
      {isFetchingAvailableCoupons && (
        <div className="flex gap-4">
          <Skeleton className="w-full h-24 max-w-xs" />
          <Skeleton className="w-full h-24 max-w-xs" />
        </div>
      )}
      {availableCoupons && !isFetchingAvailableCoupons && (
        <AvailableCoupons coupons={availableCoupons} />
      )}
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
      <TableBody className="">
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
  const t = useTranslations("Coupons");
  const locale = useLocale();
  return (
    <div className="@container flex flex-col gap-4">
      <h3 className="font-bold md:text-2xl text-xl text-primary">
        {t("myRedeemedCoupons")}
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
  const t = useTranslations("Coupons");
  return (
    <div className="@container flex flex-col gap-4">
      <h3 className="font-bold md:text-2xl text-xl text-primary">
        {t("availableCoupons")}
      </h3>
      {coupons.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {t("noteRedeemingAdventureCouponsResetsYourPointBalanceTo")}{" "}
          <Badge variant={"outline"} size={"sm"}>
            {t("70points")}
          </Badge>
        </div>
      )}
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
              <CouponRedeemDialog coupon={coupon} />
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

export const CouponRedeemDialog = ({ coupon }: { coupon: TCoupon }) => {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [agree, setAgree] = useState(false);
  const queryClient = useQueryClient();
  const t = useTranslations("Coupons");

  const mutation = useMutation({
    mutationFn: () => {
      return fetch("/api/user/redeem-coupon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": locale,
        },
        body: JSON.stringify({ code: coupon.code }),
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message, { duration: 6000 });
        queryClient.invalidateQueries({ queryKey: ["/users/profile"] });
        queryClient.invalidateQueries({
          queryKey: ["/profile/coupons/available"],
        });
        queryClient.invalidateQueries({
          queryKey: ["/profile/coupons/redeemed"],
        });
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
    onSettled() {
      setOpen(false);
    },
  });

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            {t("redeem")}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="gap-1">
            <DialogTitle>{t("redeemCoupon")}</DialogTitle>
            <DialogDescription className="gap-1 flex flex-col">
              {coupon.applyTo === "adventure" ? (
                <div>
                  {t("noteRedeemingAdventureCouponsResetsYourPointBalanceTo")}{" "}
                  <Badge variant={"outline"}>{t("70points")}</Badge>
                </div>
              ) : (
                <div>
                  {t("redeemingThisCouponWillNotImpactYourPointsBalance")}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {agree && (
            <div
              className={cn(
                "p-4 rounded-md mx-auto w-full min-h-[5rem]   bg-background gap-3 text-foreground flex justify-between border-2 border-border"
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
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button className="" type="button" variant="ghost">
                {t("close")}
              </Button>
            </DialogClose>
            <>
              {!agree && (
                <Button
                  onClick={() => setAgree(true)}
                  type="button"
                  variant="outline"
                >
                  {mutation.isPending && (
                    <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                  )}
                  {t("agree")}
                </Button>
              )}
              {agree && (
                <Button
                  onClick={() => mutation.mutate()}
                  type="button"
                  variant="secondary"
                >
                  {mutation.isPending && (
                    <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                  )}
                  {t("redeem")}
                </Button>
              )}
            </>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
