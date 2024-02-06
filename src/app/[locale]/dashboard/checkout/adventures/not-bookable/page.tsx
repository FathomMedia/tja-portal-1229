import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  return (
    <div className="flex flex-col grow justify-center items-center">
      <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-2xl my-20">
        <div className="flex justify-center md:justify-end -mt-16">
          <Image
            width={80}
            height={80}
            className="w-20 h-20 object-cover rounded-full border-4 border-secondary"
            src="/assets/images/adventure.jpg"
            alt=""
          />
        </div>
        <div>
          <h2 className="text-gray-800 text-xl sm:text-2xl mt-3 font-semibold">
            {t("adventureNotAvailable")}
          </h2>
          <p className="mt-2 text-gray-600">{t("weAreSorry")}</p>
          <ul className="list-disc pl-5 mt-2 text-gray-600">
            <li>{t("theAdventureIsFullyBooked")}</li>
            <li>{t("theAdventureDateHasPassed")}</li>
            <li>{t("youHaveAlreadyBookedThisAdventure")}</li>
          </ul>
        </div>
        <div className="flex justify-end mt-4">
          <Link
            href={`/${locale}/dashboard/adventures`}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "text-secondary hover:bg-secondary/20 hover:text-secondary"
            )}
          >
            {t("returnToAdventures")}
          </Link>
        </div>
      </div>
    </div>
  );
}
