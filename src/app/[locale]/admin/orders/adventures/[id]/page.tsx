"use client";

import { TAdventureBooking, TAdventureBookingOrder } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { ViewAdventureOrderForm } from "@/components/admin/orders/adventures/ViewAdventureOrderForm";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Adventures");
  const queryClient = useQueryClient();
  const { push } = useRouter();

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
    <div className="max-w-4xl flex flex-col gap-10 pb-20">
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          View Booking
        </h2>
      </div>
      {isFetchingAdventureBooking && <Skeleton className="w-full h-96" />}
      {adventureBooking && (
        <ViewAdventureOrderForm adventureBooking={adventureBooking} />
      )}
    </div>
  );
}
