import { useTranslations } from "next-intl";

export default async function Page() {
  const t = useTranslations("Checkout");
  return (
    <div>
      <p>{t("thisAdventureIsNotAvailable")}</p>
    </div>
  );
}
