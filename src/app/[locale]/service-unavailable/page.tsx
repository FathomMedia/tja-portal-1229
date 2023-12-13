import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import Link from "next/link";

export default async function Page() {
  const locale = useLocale();

  return (
    <div className="flex items-center justify-center h-full p-10 md:p-20">
      <div className="text-center max-w-2xl flex flex-col gap-4 items-center">
        <h1 className="text-4xl font-bold text-primary">
          We apologize for the inconvenience
        </h1>
        <p className="text-sm p-4 max-w-xl bg-muted rounded-md text-muted-foreground">
          We regret to inform you that our services are currently unavailable.
          We apologize for any inconvenience this may cause.
        </p>
        <Link
          className={cn(buttonVariants({ variant: "ghost" }))}
          href={`/${locale}`}
        >
          Retry
        </Link>
      </div>
    </div>
  );
}
