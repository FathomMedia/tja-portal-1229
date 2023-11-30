import { availableLocales, timezone } from "@/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { isRtlLang } from "rtl-detect";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { ReCaptchaProvider } from "next-recaptcha-v3";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Journey Adventures",
  description: "The Journey Adventures Portal",
};

// Can be imported from a shared config
const locales = availableLocales;

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return (
    <html dir={isRtlLang(locale) ? "rtl" : "ltr"} lang={locale}>
      <body className={cn(inter.className)}>
        <ReCaptchaProvider>
          <NextIntlClientProvider
            timeZone={timezone}
            locale={locale}
            messages={messages}
          >
            {children}
          </NextIntlClientProvider>
        </ReCaptchaProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
