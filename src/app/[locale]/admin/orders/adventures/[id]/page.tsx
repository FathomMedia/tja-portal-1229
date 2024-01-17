"use client";

import { TAdventureBookingOrder } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ViewAdventureOrderForm } from "@/components/admin/orders/adventures/ViewAdventureOrderForm";
import { DashboardSection } from "@/components/DashboardSection";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Adventures");

  const { data: adventureBooking, isFetching: isFetchingAdventureBooking } =
    useQuery<TAdventureBookingOrder>({
      queryKey: [`/adventure-bookings/${id}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/adventure-bookings/${id}`, locale }).then(
          (res) =>
            res.json().then((resData) => {
              return resData.data;
            })
        ),
    });
  return (
    <DashboardSection
      title={t("viewBooking")}
      className="max-w-4xl flex flex-col gap-10 pb-20"
    >
      {isFetchingAdventureBooking && <Skeleton className="w-full h-96" />}
      {adventureBooking && (
        <ViewAdventureOrderForm adventureBooking={adventureBooking} />
      )}
    </DashboardSection>
  );
}
