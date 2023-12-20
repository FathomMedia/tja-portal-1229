import { DashboardSection } from "@/components/DashboardSection";
import { ConsultationF } from "@/components/consultations/ConsultationsF";

import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export default async function Page() {
  const t = await getTranslations("Help");
  return (
    <DashboardSection className="flex flex-col gap-4" title={t("help")}>
      <Suspense
        fallback={
          <div className="flex flex-col gap-4">
            <Skeleton className="w-full h-16 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
          </div>
        }
      >
       <div>
      
        
       </div>
      </Suspense>
    </DashboardSection>
  );
}
