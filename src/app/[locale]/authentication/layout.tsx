import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  return (
    <div className="flex flex-col gap-6 min-h-[100svh]">
      <div className="flex sticky top-0 justify-between items-center h-20 bg-white px-6 py-4 shadow-lg shadow-accent">
        <div className="w-10 sm:block hidden"></div>
        <div className="relative h-full aspect-[3/1] ">
          <Link className="h-full" href={`/${locale}`}>
            <Image
              className="object-contain"
              fill
              src="/assets/images/logo-dark.png"
              alt="Logo"
            />
          </Link>
        </div>
        <LanguageSwitcher />
      </div>
      <div>{children}</div>
    </div>
  );
}
