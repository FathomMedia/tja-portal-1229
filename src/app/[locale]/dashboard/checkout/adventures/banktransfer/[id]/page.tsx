import { getToken } from "@/lib/serverUtils";
import { TAdventureBookingOrder } from "@/lib/types";
import { apiReq } from "@/lib/apiHelpers";
import { useLocale } from "next-intl";

import { notFound } from "next/navigation";
import { ReservedBookingCard } from "@/components/checkout/ReservedBookingCard";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const locale = useLocale();
  const token = getToken();

  const adventureBooking = await apiReq({
    endpoint: `/adventure-bookings/${id}`,
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const resData = await val.json();

      const data: TAdventureBookingOrder = resData.data;

      return data;
    }
    return null;
  });

  if (!adventureBooking || !adventureBooking.isReserved) {
    notFound();
  }

  // TODO: show the customer that the booking is reserved
  return (
    <div>
      <ReservedBookingCard booking={adventureBooking} />
    </div>
  );
}
