import { getToken } from "@/lib/serverUtils";
import { TAdventure } from "@/lib/types";
import { apiReq } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const locale = useLocale();
  const token = getToken();
  const t = await getTranslations("Adventures");

  const adventure = await apiReq({
    endpoint: `/adventures/${slug}`,
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const resData = await val.json();

      const data: TAdventure = resData.data;
      return data;
    }
    return null;
  });

  return adventure ? (
    <div className="relative flex flex-col md:flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-lg p-3  mx-auto border border-white bg-white">
      <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white relative grid place-items-center">
        <Image
          width={200}
          height={200}
          src="/assets/images/adventure.jpg"
          alt="tailwind logo"
          className="rounded-xl w-full h-full object-cover"
        />
      </div>
      <div className="w-full md:w-2/3 bg-white flex flex-col justify-between space-y-2 p-3">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between item-center">
            <div className="flex flex-wrap md:flex-row gap-2">
              <div className="bg-gray-200  px-3 py-1 rounded-full text-xs font-medium text-gray-800 flex gap-1">
                {t("startDate")}:<p>{adventure.startDate}</p>
              </div>
              <div className="bg-gray-200  px-3 py-1 rounded-full text-xs font-medium text-gray-800 flex gap-1">
                {t("endDate")}:<p>{adventure.endDate}</p>
              </div>
            </div>
          </div>
          <h3 className="font-black text-gray-800 md:text-3xl text-xl pt-3">
            {adventure.title}
          </h3>
          <p className="md:text-lg text-gray-500 text-base">
            {adventure.description}
          </p>
        </div>
        <p className="text-gray-600 mb-4">
          <span className="font-bold">{t("country")}</span> {adventure.country}
        </p>

        <p className="text-gray-600 mb-4">
          <span className="font-bold">{t("continent")}:</span>{" "}
          {adventure.continent}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-bold">{t("price")}:</span> {adventure.price}
        </p>
        <div className="lg:col-span-2 bg-white rounded-lg pt-4">
          <Link
            href={`/${locale}/dashboard/checkout/adventures/${adventure.slug}`}
            className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-[#1E473F] px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
          >
            {t("bookNow")}
          </Link>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <p>{t("nothingFound")}</p>
    </div>
  );
}
