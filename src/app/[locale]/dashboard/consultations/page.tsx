import { DashboardSection } from "@/components/DashboardSection";
import ConsultationForm from "@/components/dashboard/consultations/ConsultationForm";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Page() {
  const t = await getTranslations("Consultation");
  return (
    <DashboardSection className="flex flex-col gap-4" title={t("consultation")}>
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-16 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
          </div>
        }
      >
        <ConsultationForm />
      </Suspense>
    </DashboardSection>
  );
}
