import { JourneysMiles } from "@/components/dashboard/JourneysMiles";
import { getToken } from "@/lib/serverUtils";
import { TLevels } from "@/lib/types";
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

  const levels = await apiReq({
    endpoint: "/levels",
    locale,
    token: token,
  }).then(async (val) => {
    const res: TLevels = await val.json();
    return res.data;
  });

  return (
    <div>
      <JourneysMiles user={user} levels={levels} />
    </div>
  );
}
