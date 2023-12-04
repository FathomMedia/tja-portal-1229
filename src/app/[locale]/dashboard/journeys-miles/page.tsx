import { JourneysMiles } from "@/components/dashboard/JourneysMiles";
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

  return (
    <div>
      <JourneysMiles user={user} />
    </div>
  );
}
