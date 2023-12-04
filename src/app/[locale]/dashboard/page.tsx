import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { getToken } from "@/lib/serverUtils";
import { apiReq } from "@/lib/utils";
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

  // const latestOrders = await apiReq({
  //   endpoint: "/profile/bookings",
  //   locale,
  //   token: token?.value,
  // }).then(async (val) => {
  //   const { data } = await val.json();
  //   return data;
  // });
  // console.log("🚀 ~ file: page.tsx:36 ~ Page ~ latestOrders:", latestOrders);

  return (
    <div>
      <DashboardHome user={user} />
    </div>
  );
}
