import { DashboardSection } from "@/components/DashboardSection";
import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { Button } from "@/components/ui/button";
import { UserProfilePreview } from "@/components/user/UserProfilePreview";
import { useAppContext } from "@/contexts/AppContext";
import { getUser } from "@/lib/apiHelpers";
import { apiReq } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { cookies } from "next/headers";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export default async function Page() {
  const locale = useLocale();
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");

  const user = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token?.value,
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
