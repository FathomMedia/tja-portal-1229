import { getToken } from "@/lib/serverUtils";
import { TPaginatedAdventures } from "@/lib/types";
import { apiReq } from "@/lib/utils";
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
          <Link
            href={`adventures/${adventure.slug}`}
            // className="bg-primary p-3 text-primary-foreground"
            key={i}
          >
            <div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              {/* <img className="rounded-t-lg" src="/docs/images/blog/image-1.jpg" alt="" /> */}
              <div className="p-5">
                <a href="#">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <p>{adventure.title}</p>
                  </h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  Here are the biggest enterprise technology acquisitions of
                  2021 so far, in reverse chronological order.
                </p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                  {adventure.country}
                </p>
                <a
                  href={`adventures/${adventure.slug}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-[#1E473F] rounded-lg hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {t("discover")}
                </a>
              </div>
            </div>
          </Link>
        ))}
      {!paginatedAdventures && (
        <div>
          <p>Failed to get the adventures</p>
        </div>
      )}
    </div>
  );
}
