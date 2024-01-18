import { cn } from "@/lib/utils";
import { SignInWithPassword } from "@/components/auth/sign-in-with-password";
import { SignInWithEmailOTP } from "@/components/auth/sign-in-with-email-otp";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUp } from "@/components/auth/sign-up";
import { useLocale, useTranslations } from "next-intl";
import { isRtlLang } from "rtl-detect";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionTriggerWithoutIcon,
} from "../ui/accordion";
import { Separator } from "../ui/separator";

export function UserAuthForm() {
  const locale = useLocale();
  const t = useTranslations("Auth");
  return (
    <div className={cn("", "w-full flex flex-col justify-center")}>
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
          className="pt-6 max-w-2xl w-full items-center flex flex-col gap-4 sm:gap-6"
          // className="pt-6 max-w-2xl w-full items-center flex flex-col md:flex-row gap-4 sm:gap-6"
        >
          <SignInWithPassword />
          {/* <div className="relative hidden md:flex flex-col justify-center h-full min-h-[10rem]">
            <div className="absolute inset-0 h-full flex flex-col items-center">
              <span className="h-full border-r" />
            </div>
            <div className="relative flex justify-center text-xs py-3 uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("Or")}
              </span>
            </div>
          </div> */}
          {/* <div className="py-6 w-full flex items-center">
            <span className="h-[1px] w-full bg-border"></span>
            <span className="px-2 text-muted-foreground">{t("Or")}</span>
            <span className="h-[1px] w-full bg-border"></span>
          </div> */}
          {/* <div className="relative w-full justify-center flex md:hidden items-center">
            <div className="absolute inset-0  flex flex-col justify-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs py-3 uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("Or")}
              </span>
            </div>
          </div> */}
          <Separator className="mt-4" />
          <Accordion className="w-full" type="single" collapsible>
            <AccordionItem value="item-1" className="border-b-0">
              <AccordionTriggerWithoutIcon className="text-muted-foreground text-sm font-medium justify-center">
                {t("signInUsingOTP")}
              </AccordionTriggerWithoutIcon>
              <AccordionContent>
                <div className="h-full w-full mb-auto mt-4">
                  <SignInWithEmailOTP />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </TabsContent>
        <TabsContent className="w-full" value="register">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
