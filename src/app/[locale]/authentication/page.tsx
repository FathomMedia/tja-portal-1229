import { Metadata } from "next";

import { UserAuthForm } from "@/components/auth/user-auth-form";
import { useTranslations } from "next-intl";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Authentication",
  description: "The Journey Adventures Authentication",
};

export default function Page() {
  const t = useTranslations("SignUp");
  return (
    <div className=" w-full h-full grid grid-cols-1 lg:grid-cols-2   relative">
      <Image
        src={"/assets/images/auth-image.jpeg"}
        fill
        className="absolute inset-0 lg:max-w-[50%]  object-cover z-0"
        alt="Auth Image"
      />
      {/* auth card */}
      <div className="flex  flex-col lg:col-start-2   z-10 items-center justify-center p-10 lg:p-0   ">
        <div className="bg-white h-fit lg:h-full w-full  shadow-2xl rounded-2xl p-10 flex gap-10 items-center lg:rounded-none flex-col justify-center">
          <div className="max-w-2xl w-full flex flex-col gap-10 lg:gap-20">
            <div className="relative w-full h-16 sm:h-20">
              <Image
                className="object-contain"
                fill
                src="/assets/images/logo-dark.png"
                alt="Logo"
              />
            </div>
            {/* <p className="font-black font-helveticaNeue text-xl lg:text-3xl text-primary">
              {t("welcomeBack")}
            </p> */}
            <UserAuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
