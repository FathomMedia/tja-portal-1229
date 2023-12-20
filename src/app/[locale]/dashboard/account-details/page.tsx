import { Separator } from "@/components/ui/separator";
import { DeleteProfile } from "@/components/user/DeleteUserProfile";
import { UserAccountDetails } from "@/components/user/UserAccountDetails";
import { UserUpdateEmail } from "@/components/user/UserUpdateEmail";
import { UpdatePassword } from "@/components/user/UserUpdatePassword";
import { getToken } from "@/lib/serverUtils";
import { TUser } from "@/lib/types";
import { apiReq } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const locale = useLocale();
  const token = getToken();
  const t = await getTranslations("Profile");

  const user = await apiReq({
    endpoint: "/users/profile",
    locale,
    token: token,
  }).then(async (val) => {
    const { data } = await val.json();
    return data as TUser;
  });

  return (
    <div className="max-w-4xl flex flex-col gap-10">
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          {t("updateProfile")}
        </h2>
      </div>
      <UserAccountDetails user={user} />
      <Separator />
      <div className=" space-y-4">
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          {t("updateEmail")}
        </h2>
        <div className=" text-sm text-muted-foreground">
          {t("yourEmail")}: <span className=" italic">{user.email}</span>
        </div>
      </div>
      <UserUpdateEmail />
      <Separator />
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          {t("changePassword")}
        </h2>
      </div>
      <UpdatePassword />
      <Separator />
      <div>
        <DeleteProfile />
      </div>
    </div>
  );
}
