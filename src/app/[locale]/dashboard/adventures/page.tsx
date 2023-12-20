import { getToken } from "@/lib/serverUtils";
import { TPaginatedAdventures } from "@/lib/types";
import { apiReq } from "@/lib/apiHelpers";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function Page() {
  const locale = useLocale();
  const token = getToken();
  const t = await getTranslations("Adventures");

  const paginatedAdventures = await apiReq({
    endpoint: "/adventures",
    locale,
    token: token,
  }).then(async (val) => {
    if (val.ok) {
      const data: TPaginatedAdventures = await val.json();
      return data;
    }
    return null;
  });

  return (
    <div className="flex flex-col gap-2">
      {paginatedAdventures &&
        paginatedAdventures.data.map((adventure, i) => (
          <Link href={`adventures/${adventure.slug}`} key={i}>
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="p-5">
                <div>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <p>{adventure.title}</p>
                  </h5>
                </div>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {adventure.description}
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {adventure.country}
                </p>
                <div className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#1E473F] rounded-lg hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  {t("discover")}
                </div>
              </div>
            </div>
          </Link>
        ))}
      {!paginatedAdventures && (
        <div className="text-center text-muted-foreground bg-muted p-4 rounded-md">
          <p>Failed to retrieve adventures</p>
        </div>
      )}
    </div>
  );
}
