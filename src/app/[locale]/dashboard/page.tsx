import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { getToken } from "@/lib/serverUtils";
import { TOrders } from "@/lib/types";
import { apiReq } from "@/lib/utils";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";

export default async function Page() {
  const locale = useLocale();
  const token = getToken();

  const user = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const { data } = await val.json();
      return data;
    } else {
      notFound();
    }
  });

  const latestOrders = await apiReq({
    endpoint: "/profile/bookings",
    locale,
    token: token,
  }).then(async (val) => {
    const res: TOrders = await val.json();
    return res.data;
  });

  return (
    <div className="max-w-4xl">
      <DashboardHome user={user} latestOrders={latestOrders} />
    </div>
  );
}
