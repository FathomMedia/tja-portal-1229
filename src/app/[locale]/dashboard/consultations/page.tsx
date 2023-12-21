import { DashboardSection } from "@/components/DashboardSection";
import { CalculateConsultation } from "@/components/consultations/CalculateConsultation";
import { ConsultationF } from "@/components/consultations/ConsultationsF";

import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Page() {
  const t = await getTranslations("Consultation");
  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          Book a consultation
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
        <CalculateConsultation />
        <ConsultationF />
      </Suspense>
    </div>
  );
}
