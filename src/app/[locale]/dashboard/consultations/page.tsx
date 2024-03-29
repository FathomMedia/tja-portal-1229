"use client";

import { DashboardSection } from "@/components/DashboardSection";
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
  const [showForm, setShowForm] = useState(false);
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
    <DashboardSection
      title={t("bookAConsultation")}
      className="max-w-4xl flex flex-col gap-6"
    >
      <Suspense
        fallback={
          <div className="flex flex-col  gap-4">
            <Skeleton className="w-full h-16 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
          </div>
        }
      >
        <CalculateConsultation
          onPackageChanged={(val) => {
            setSelectedPackage(val);
            setShowForm(true);
          }}
          defaultTier={defaultTier}
          startDate={(val) => setStartDate(val)}
          endDate={(val) => setEndDate(val)}
          hideForm={() => {
            setShowForm(false);
          }}
        />
        {selectedPackage && startDate && endDate && (
          <ConsultationForm
            show={Boolean(selectedPackage && startDate && endDate && showForm)}
            chosenPackage={selectedPackage}
            startDate={startDate}
            endDate={endDate}
          />
        )}
      </Suspense>
    </DashboardSection>
  );
}
