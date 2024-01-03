import { AdventureCheckoutForm } from "@/components/checkout/AdventureCheckoutForm";
import { getToken } from "@/lib/serverUtils";
import { TAdventure } from "@/lib/types";
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

  if (!adventure) {
    notFound();
  }

  /* Checking if the adventure is full or not upcoming.
  If either of these conditions is true,
  it will redirect the user to the not-bookable page. */
  if (adventure.isFull || !adventure.isUpcoming) {
    redirect(`/${locale}/dashboard/checkout/adventures/not-bookable`);
  }

  return <AdventureCheckoutForm initAdventure={adventure} />;
}
