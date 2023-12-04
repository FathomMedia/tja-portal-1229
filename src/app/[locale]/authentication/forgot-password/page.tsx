import { useTranslations } from "next-intl";

export default function Page() {
  const t= useTranslations("Auth");
  return (
    <div>
      <h1>{t("forgetPassword")}</h1>
    </div>
  );
}
