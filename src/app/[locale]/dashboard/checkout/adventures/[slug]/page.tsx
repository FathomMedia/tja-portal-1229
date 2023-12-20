import { AdventureCheckoutForm } from "@/components/checkout/AdventureCheckoutForm";
import { getToken } from "@/lib/serverUtils";
import { TAdventure, TCoupon, TUser } from "@/lib/types";
import { apiReq } from "@/lib/apiHelpers";
import { useLocale } from "next-intl";

import { notFound, redirect } from "next/navigation";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const locale = useLocale();
  const token = getToken();

  // TODO: awaitAll (PromiseAll)

  const user: TUser = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token,
  }).then(async (val) => {
    const { data } = await val.json();
    return data;
  });

  const adventure = await apiReq({
    endpoint: `/adventures/${slug}`,
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const resData = await val.json();
      const data: TAdventure = resData.data;
      return data;
    }
    return null;
  });
  const myCoupons = await apiReq({
    endpoint: `/profile/coupons/redeemed`,
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const resData = await val.json();
      const data: TCoupon[] = resData.data;
      return data;
    }
    return null;
  });

  if (!adventure) {
    notFound();
  }

  /* Checking if the adventure is full or not upcoming.
  If either of these conditions is true,
  it will redirect the user to the not-bookable page. */
  if (adventure.isFull || !adventure.isUpcoming) {
    redirect(`/${locale}/dashboard/checkout/adventures/not-bookable`);
  }

  return (
    <AdventureCheckoutForm
      adventure={adventure}
      user={user}
      myCoupons={myCoupons}
    />
  );
}
