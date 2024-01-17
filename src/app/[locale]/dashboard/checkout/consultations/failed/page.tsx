"use client";
import { TAdventure } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2, Globe } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatePrice } from "@/lib/utils";

export default function Page() {
  const locale = useLocale();

  const t = useTranslations("Consultations");

  return (
    <div className="flex flex-col grow gap-4 max-w-4xl">
      <div>
        <Alert className="text-primary-foreground border-primary-foreground bg-secondary">
          <AlertCircleIcon className="h-4 w-4 !text-primary-foreground " />
          <AlertTitle>{t("bookingFailed")}</AlertTitle>
          {/* Booking Failed */}
          <AlertDescription className="text-xs">
            {t("failedToConfirmYourBooking")}
          </AlertDescription>
          {/* Failed to confirm your booking, please try again */}
        </Alert>
      </div>

      <div className="p-2 bg-primary text-primary-foreground text-sm rounded-md w-fit flex justify-center items-center">
        <Link href={`/${locale}/dashboard/consultations`}>
          {t("goToConsultations")}
        </Link>
      </div>
    </div>
  );
}
