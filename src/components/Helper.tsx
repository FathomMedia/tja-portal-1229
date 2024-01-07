import { useTranslations } from "next-intl";

export const DisplayTranslatedText = ({
  text,
  translation,
}: {
  text: string;
  translation: string;
}) => {
  const t = useTranslations(translation);
  return <p className="">{t(text)}</p>;
};
