import { cn } from "@/lib/utils";
import { SignInWithPassword } from "@/components/auth/sign-in-with-password";
import { SignInWithEmailOTP } from "@/components/auth/sign-in-with-email-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUp } from "@/components/auth/sign-up";
import { useLocale, useTranslations } from "next-intl";
import { isRtlLang } from "rtl-detect";

export function UserAuthForm() {
  const locale = useLocale();
  const t= useTranslations("Auth");
  return (
    <div className={cn("grid gap-6", "w-full")}>
      <Tabs
        dir={isRtlLang(locale) ? "rtl" : "ltr"}
        defaultValue="login"
        className=""
      >
        <TabsList className="grid w-full grid-cols-2">
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
        <TabsContent value="login" className="pt-6">
          <SignInWithPassword />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs py-3 uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("Or")}
              </span>
            </div>
          </div>
          <SignInWithEmailOTP />
        </TabsContent>
        <TabsContent value="register">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
