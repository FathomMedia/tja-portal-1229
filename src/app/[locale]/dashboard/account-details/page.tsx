import { Separator } from "@/components/ui/separator";
import { DeleteProfile } from "@/components/user/DeleteUserProfile";
import { UserAccountDetails } from "@/components/user/UserAccountDetails";
import { UserUpdateEmail } from "@/components/user/UserUpdateEmail";
import { UpdatePassword } from "@/components/user/UserUpdatePassword";
import { getToken } from "@/lib/serverUtils";
import { TUser } from "@/lib/types";
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
    return data as TUser;
  });

  return (
    <div className="max-w-4xl flex flex-col gap-10">
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          Update profile
        </h2>
      </div>
      <UserAccountDetails user={user} />
      <Separator />
      <div className=" space-y-4">
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          Update email
        </h2>
        <div className=" text-sm text-muted-foreground">
          Your email: <span className=" italic">{user.email}</span>
        </div>
      </div>
      <UserUpdateEmail />
      <Separator />
      <div>
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          Update password
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
