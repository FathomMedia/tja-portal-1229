"use client";

import { CalculateConsultation } from "@/components/consultations/CalculateConsultation";
import { ConsultationForm } from "@/components/consultations/ConsultationsF";

import { Skeleton } from "@/components/ui/skeleton";
import { TConsultation } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function Page() {
  const t = useTranslations("Consultation");

  const allowedPackages = ["silver", "gold", "platinum"];
  const [selectedPackage, setSelectedPackage] = useState<TConsultation | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const searchParams = useSearchParams()!;

  const defaultTier = allowedPackages.includes(searchParams.get("tier") ?? "")
    ? searchParams.get("tier") ?? "silver"
    : "silver";

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div>package: {selectedPackage?.id}</div>
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          {t("bookAConsultation")}
        </h2>
      </div>
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-16 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
          </div>
        }
      >
        <CalculateConsultation
          onPackageChanged={(val) => setSelectedPackage(val)}
          defaultTier={defaultTier}
          startDate={(val) => setStartDate(val)}
          endDate={(val) => setEndDate(val)}
        />
        {selectedPackage && startDate && endDate && (
          <ConsultationForm
            chosenPackage={selectedPackage}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </Suspense>
    </div>
  );
}
