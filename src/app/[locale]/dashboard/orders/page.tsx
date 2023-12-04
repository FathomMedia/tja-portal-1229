import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Home");

  return (
    <div className="p-6 flex flex-col gap-4">
      {/* Up coming adventures */}
      <div className="bg-muted flex p-3 rounded-lg">
        <h1>{t("upComingAdventures")}</h1>
      </div>
      {/* Up coming adventures */}
      <div className="bg-muted flex p-3 rounded-lg">
        <h1>{t("latestsOrders")}</h1>
      </div>
    </div>
  );
}
