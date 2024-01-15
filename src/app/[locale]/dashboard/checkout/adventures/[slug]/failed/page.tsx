"use client";
import { TAdventure } from "@/lib/types";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2, Globe } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, formatePrice } from "@/lib/utils";

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const locale = useLocale();

  const t = useTranslations("Adventures");

  const { data: adventure, isFetching: isFetchingAdventure } =
    useQuery<TAdventure>({
      queryKey: [`/adventures/${slug}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/adventures/${slug}`, locale }).then((res) =>
          res.json().then((resData) => resData.data)
        ),
    });

  return (
    <div className="flex flex-col grow gap-4">
      <div>
        <Alert className="text-primary-foreground border-primary-foreground bg-secondary">
          <AlertCircleIcon className="h-4 w-4 !text-primary-foreground " />
          <AlertTitle>{t("bookingFailed")}</AlertTitle>
          {/* Booking Failed */}
          <AlertDescription className="text-xs">
            {t("failedToConfirmYourBooking")}
          </AlertDescription>
          {/* Failed to confirm your booking, please try again */}
        </Alert>
      </div>

      {isFetchingAdventure && <Skeleton className="w-full h-72" />}
      {!adventure && !isFetchingAdventure && (
        <div className="p-2 bg-primary text-primary-foreground text-sm rounded-md w-fit flex justify-center items-center">
          <Link href={`/${locale}/dashboard/adventures`}>
            {t("goToAdventures")}
            {/* {"Go to Adventures"} */}
          </Link>
        </div>
      )}
      {adventure && !isFetchingAdventure && (
        <div className="relative w-full flex flex-col md:flex-row md:gap-5 space-y-3 md:space-y-0 rounded-xl p-4  mx-auto  border  border-white bg-white">
          <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white relative grid place-items-center">
            <Image
              width={200}
              height={200}
              src={adventure.image ?? "/assets/images/adventure.jpg"}
              alt={adventure.title}
              className="rounded-md w-full h-full object-cover"
            />
          </div>
          <div className="w-full @container md:w-2/3 bg-white group  flex flex-col justify-between space-y-2 p-3">
            <div className="flex flex-col gap-2 ">
              <div className="flex justify-between item-center">
                <p className="text-gray-500 font-light hidden md:block">
                  {t("adventure")}
                </p>
              </div>
              <Link
                href={`/${locale}/dashboard/adventures/${adventure.slug}`}
                className="font-black flex group-hover:underline items-center gap-1 font-helveticaNeue text-primary md:text-3xl text-xl"
              >
                {adventure.title}{" "}
                <span>
                  <Globe className="mb-2" />
                </span>
              </Link>

              <div className=" gap-4 flex flex-col @md:flex-row text-sm text-primary py-6">
                <p>
                  {t("startDate")} {adventure.startDate}
                </p>
                <p>
                  {t("endDate")} {adventure.endDate}
                </p>
              </div>
            </div>
            <div className="w-full flex gap-3 flex-col @sm:flex-row  justify-between items-start @sm:items-end">
              <Link
                href={`/${locale}/dashboard/adventures/${adventure.slug}`}
                type="button"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "flex items-center gap-1"
                )}
              >
                {t("tryAgain")}
                <span>
                  <Globe className="w-4 h-5" />
                </span>
              </Link>

              <div className="flex items-baseline gap-2">
                <p className="text-sm text-muted-foreground">{t("total")}</p>
                <p className="text-xl font-black text-primary ">
                  {formatePrice({ locale, price: adventure.price })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
