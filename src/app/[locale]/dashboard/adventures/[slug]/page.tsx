import { getToken } from "@/lib/serverUtils";
import { TAdventure } from "@/lib/types";
import { apiReq } from "@/lib/utils";
import { useLocale } from "next-intl";
import { notFound } from "next/navigation";
import Image from "next/image";

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const locale = useLocale();
  const token = getToken();

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
    <div className="flex flex-col gap-3">
      <div className="relative w-full rounded-lg overflow-clip">
        <Image
          width={800}
          height={350}
          className="w-full aspect-[16/6] object-cover"
          alt="Adventure"
          src={"/assets/images/adventure.jpg"}
        />
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl text-primary font-semibold">
          {adventure.title}
        </h2>
        <p>{adventure.description}</p>
      </div>
    </div>
  ) : (
    <div>
      <p>Not Found</p>
    </div>
  );
}
