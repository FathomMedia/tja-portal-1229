import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Home");

  return (
    <div className="p-6 flex flex-col gap-4 max-w-4xl">
      {/* Up coming adventures */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl text-primary">{t("upComingAdventures")}</h1>
      </div>
      {/* Up coming adventures */}

      <div className="flex flex-col gap-2">
        <h1 className="text-xl text-primary">{t("latestsOrders")}</h1>
      </div>
    </div>
  );
}
