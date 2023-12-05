import { getToken } from "@/lib/serverUtils";
import { TAdventure } from "@/lib/types";
import { apiReq } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const locale = useLocale();
  const token = getToken();
  const  t = await getTranslations("Adventures");

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
    // <div className="flex flex-col gap-3">
    //   <div className="relative w-full rounded-lg overflow-clip">
    //     <Image
    //       width={800}
    //       height={350}
    //       className="w-full aspect-[16/6] object-cover"
    //       alt="Adventure"
    //       src={"/assets/images/adventure.jpg"}
    //     />
    //   </div>
    //   <div className="flex flex-col gap-3">
    //     <h2 className="text-2xl text-primary font-semibold">
    //       {adventure.title}
    //     </h2>
    //     <p>{adventure.description}</p>
    //   </div>
    // </div>
  //   <section className="py-12 sm:py-16">
  //   <div className="container mx-auto px-4">
  //     <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-3">
  //       <div className="lg:col-span-1">
  //         <div className="max-w-xl overflow-hidden rounded-lg">
  //           <Image
  //             src="/assets/images/adventure.jpg"
  //             alt="Product Image"
  //             width={800}
  //             height={600}
  //             className="h-full w-full object-cover rounded-lg"
  //           />
  //         </div>
  //       </div>

  //       <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
  //         <h1 className="text-3xl font-bold mb-4">{adventure.title}</h1>

  //         <p className="text-gray-600 mb-4">
  //           {adventure.description}
  //         </p>

  //         <div className="flex mb-4">
  //           <p className="text-gray-600">
  //             <span className="font-bold">{t("startDate")}</span> {adventure.startDate}
  //           </p>
  //           <p className="text-gray-600 mr-4 ml-4">
  //             <span className="font-bold">{t("endDate")}</span> {adventure.endDate}
  //           </p>
  //         </div>

  //         <p className="text-gray-600 mb-4">
  //           <span className="font-bold">{t("country")}</span> {adventure.country}
  //         </p>

  //         <p className="text-gray-600 mb-4">
  //           <span className="font-bold">{t("continent")}:</span> {adventure.continent}
  //         </p>

  //         <p className="text-gray-600 mb-4">
  //           <span className="font-bold">{t("price")}:</span> {adventure.price}
  //         </p>

  //         <button
  //           type="button"
  //           className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-[#1E473F] px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800"
  //          >
  //           {t("bookNow")}
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // </section>


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
             <span className="font-bold">{t("continent")}:</span> {adventure.continent}
         </p>
         <p className="text-gray-600 mb-4">
            <span className="font-bold">{t("price")}:</span> {adventure.price}
           </p>
           <div className="lg:col-span-2 bg-white rounded-lg pt-4">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border-2 border-transparent bg-[#1E473F] px-12 py-3 text-center text-base font-bold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
            {t("bookNow")}
          </button>
          </div>
            </div>
            </div>

              ) : (
                <div>
                  <p>{t("nothingFound")}</p>
                </div>
              );
            }
