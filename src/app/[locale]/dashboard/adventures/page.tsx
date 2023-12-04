import { getToken } from "@/lib/serverUtils";
import { TPaginatedAdventures } from "@/lib/types";
import { apiReq } from "@/lib/utils";
import { useLocale } from "next-intl";
import Link from "next/link";

export default async function Page() {
  const locale = useLocale();
  const token = getToken();

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
            className="bg-primary p-3 text-primary-foreground"
            key={i}
          >
            <p>{adventure.id}</p>
            <p>{adventure.title}</p>
            <p>{adventure.slug}</p>
            <p>{JSON.stringify(adventure)}</p>
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
