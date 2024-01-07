import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("Checkout");
  return (
    <div>
      <p>{t("thisAdventureIsNotAvailable")}</p>
    </div>
  );
}
