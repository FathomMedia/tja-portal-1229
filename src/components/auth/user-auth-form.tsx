import { cn } from "@/lib/utils";
import { SignInWithPassword } from "@/components/auth/sign-in-with-password";
import { SignInWithEmailOTP } from "@/components/auth/sign-in-with-email-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUp } from "@/components/auth/sign-up";
import { useLocale, useTranslations } from "next-intl";
import { isRtlLang } from "rtl-detect";

export function UserAuthForm() {
  const locale = useLocale();
  const t = useTranslations("Auth");
  return (
    <div className={cn("max-w-2xl", "w-full flex flex-col justify-center")}>
      <Tabs
        dir={isRtlLang(locale) ? "rtl" : "ltr"}
        defaultValue="login"
        className=" w-full flex flex-col items-center "
      >
        <TabsList className="grid w-full  grid-cols-2">
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="login"
          >
            {t("login")}
          </TabsTrigger>
          <TabsTrigger
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            value="register"
          >
            {t("Register")}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="login"
          className="pt-6 max-w-2xl w-full items-center flex flex-col md:flex-row gap-4 sm:gap-6"
        >
          <SignInWithPassword />
          <div className="relative hidden md:flex flex-col justify-center h-full min-h-[10rem]">
            <div className="absolute inset-0 h-full flex flex-col items-center">
              <span className="h-full border-r" />
            </div>
            <div className="relative flex justify-center text-xs py-3 uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("Or")}
              </span>
            </div>
          </div>
          <div className="relative w-full justify-center flex md:hidden items-center">
            <div className="absolute inset-0  flex flex-col justify-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs py-3 uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("Or")}
              </span>
            </div>
          </div>
          <div className="h-full w-full mb-auto">
            <SignInWithEmailOTP />
          </div>
        </TabsContent>
        <TabsContent className="max-w-md" value="register">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
