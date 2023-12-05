import { ForgetPasswordForm } from "@/components/auth/forget-password-form";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Auth");
  return (
    <div className="container ">
      <div className="p-6 md:p-20 flex justify-center">
        <div className="max-w-sm w-full">
          <ForgetPasswordForm />
        </div>
      </div>
    </div>
  );
}
