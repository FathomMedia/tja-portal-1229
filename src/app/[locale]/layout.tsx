import "@/app/globals.css";
import { availableLocales, timezone } from "@/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
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

const open_Sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open_Sans",
});

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
      className={cn(helveticaNeue.variable, open_Sans.variable)}
    >
      <body>
        <ReCaptchaProvider language={locale}>
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
