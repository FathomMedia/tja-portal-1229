"use client";

import { TConsultationBooking } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewConsultationOrderForm } from "@/components/admin/orders/consultation/ViewConsultationOrderForm";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  const {
    data: consultationBooking,
    isFetching: isFetchingConsultationBooking,
  } = useQuery<TConsultationBooking>({
    queryKey: [`/consultation-bookings/${id}`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/consultation-bookings/${id}`, locale }).then(
        (res) =>
          res.json().then((resData) => {
            return resData.data;
          })
      ),
  });

  return (
    <div className="max-w-4xl flex flex-col gap-10 pb-20">
      {isFetchingConsultationBooking && <Skeleton className="w-full h-96" />}
      {!consultationBooking && !isFetchingConsultationBooking && (
        <div className="p-4 bg-muted text-muted-foreground text-sm rounded-md h-72 flex flex-col justify-center items-center">
          <p>{t("nothingFound")}</p>
        </div>
      )}
      {consultationBooking && !isFetchingConsultationBooking && (
        <ViewConsultationOrderForm consultationBooking={consultationBooking} />
      )}
    </div>
  );
}
