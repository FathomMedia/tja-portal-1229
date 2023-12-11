import { ConsultationForm } from "@/components/dashboard/consultations/ConsultationForm";
import { getToken } from "@/lib/serverUtils";
import { TPaginatedAdventures } from "@/lib/types";
import { apiReq } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export default function Page() {
  const locale = useLocale();
  const token = getToken();
  const t = useTranslations("Consultations");
  var isFirstStep = true;

  const handleProceedClick = () => {
    isFirstStep = false;
  };

  return <ConsultationForm></ConsultationForm>;
}

function useClient() {
  throw new Error("Function not implemented.");
}
