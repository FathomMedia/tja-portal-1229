import { availableLocales, timezone } from "@/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { NextIntlClientProvider, useMessages } from "next-intl";
import { isRtlLang } from "rtl-detect";
import { cn } from "@/lib/utils";

import { ReCaptchaProvider } from "next-recaptcha-v3";
import { Toaster } from "@/components/ui/sonner";

import TanstackProvider from "@/providers/TanstackProvider";
import localFont from "next/font/local";

import type { Viewport } from "next";

export const viewport: Viewport = {
  maximumScale: 1,
};

const helveticaNeue = localFont({
  src: [
    {
      path: "../fonts/helveticaNeue/HelveticaNeueLTStd-Bd.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/helveticaNeue/HelveticaNeueLTStd-BlkCn.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-helveticaNeue",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "The Journey Adventures",
  description: "The Journey Adventures Portal",

  // "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
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
    <html
      dir={isRtlLang(locale) ? "rtl" : "ltr"}
      lang={locale}
      className={cn(inter.variable, helveticaNeue.variable)}
    >
      {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/> */}
      <body>
        <ReCaptchaProvider>
          <NextIntlClientProvider
            timeZone={timezone}
            locale={locale}
            messages={messages}
          >
            <TanstackProvider>{children}</TanstackProvider>
          </NextIntlClientProvider>
        </ReCaptchaProvider>
        <Toaster duration={5000} closeButton />
      </body>
    </html>
  );
}
