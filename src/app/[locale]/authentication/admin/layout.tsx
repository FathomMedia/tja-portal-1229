import { DashboardSection } from "@/components/DashboardSection";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  return (
    <div className="container max-w-xl flex flex-col gap-6 p-3">
      <h2 className=" text-2xl font-semibold text-primary">Admin Invitation</h2>
      <div className=" ">{children}</div>
    </div>
  );
}
