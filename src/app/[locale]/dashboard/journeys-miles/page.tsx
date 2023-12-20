import { JourneysMiles } from "@/components/dashboard/JourneysMiles";
import { getToken } from "@/lib/serverUtils";
import { TCoupon, TLevels } from "@/lib/types";
import { apiReq } from "@/lib/apiHelpers";
import { useLocale } from "next-intl";

export default async function Page() {
  const locale = useLocale();
  const token = getToken();

  const user = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token,
  }).then(async (val) => {
    const { data } = await val.json();
    return data;
  });

  const levels = await apiReq({
    endpoint: "/levels",
    locale,
    token: token,
  }).then(async (val) => {
    const res: TLevels = await val.json();
    return res.data;
  });

  const availableCoupons = await apiReq({
    endpoint: "/profile/coupons/available",
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const resData = await val.json();
      return resData.data as TCoupon[];
    } else {
      const resData = await val.json();
      console.log(
        "🚀 ~ journeys-miles file: page.tsx:40 ~ Page ~ resData.message:",
        resData.message
      );
    }
    return [];
  });

  const redeemedCoupons = await apiReq({
    endpoint: "/profile/coupons/redeemed",
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const resData = await val.json();
      return resData.data as TCoupon[];
    } else {
      const resData = await val.json();
      console.log(
        "🚀 ~ journeys-miles file: page.tsx:56 ~ Page ~ resData.message:",
        resData.message
      );
    }

    return [];
  });

  const coupons = {
    available: availableCoupons,
    redeemed: redeemedCoupons,
  };

  return (
    <div className="max-w-4xl">
      <JourneysMiles user={user} levels={levels} coupons={coupons} />
    </div>
  );
}
