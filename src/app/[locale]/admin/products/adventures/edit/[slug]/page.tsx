"use client";
import { AdventureForm } from "@/components/admin/products/adventures/AdventureForm";
import { Separator } from "@/components/ui/separator";

import { TAddon, TAdventure, TCountry } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";

import { apiReqQuery } from "@/lib/apiHelpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { DashboardSection } from "@/components/DashboardSection";

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const locale = useLocale();

  const t = useTranslations("Adventures");
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const { data: adventure, isFetching: isFetchingAdventure } =
    useQuery<TAdventure>({
      queryKey: [`/adventures/${slug}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/adventures/${slug}`, locale }).then((res) =>
          res.json().then((resData) => resData.data)
        ),
    });

  const { data: countries, isFetching: isFetchingCountries } = useQuery<
    TCountry[]
  >({
    queryKey: [`/countries`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/countries`, locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
    staleTime: Infinity,
  });
  const { data: addons, isFetching: isFetchingAddons } = useQuery<TAddon[]>({
    queryKey: [`/add-ons`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/add-ons`, locale }).then((res) =>
        res.json().then((resData) => {
          return resData.data;
        })
      ),
    staleTime: Infinity,
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/adventure/delete-adventure`, {
        method: "POST",
        body: JSON.stringify({
          slug: adventure?.slug,
        }),
        headers: {
          "Accept-Language": locale,
          "Content-Type": "application/json",
        },
      });
    },
    async onSuccess(data) {
      if (data.ok) {
        const { message } = await data.json();
        toast.success(message);
        queryClient.invalidateQueries({
          queryKey: [`/adventures/${slug}`],
        });
        queryClient.invalidateQueries({ queryKey: [`/adventures`] });
        push(`/${locale}/admin/products?type=adventures`);
      } else {
        const { message } = await data.json();
        toast.error(message, { duration: 6000 });
      }
    },
    async onError(error) {
      toast.error(error.message, { duration: 6000 });
    },
  });

  return (
    <DashboardSection
      title={t("editAdventure")}
      className="max-w-4xl flex flex-col gap-10 pb-20"
    >
      {(isFetchingAdventure || isFetchingCountries || isFetchingAddons) && (
        <Skeleton className="w-full h-96" />
      )}
      {adventure &&
        countries &&
        addons &&
        !isFetchingAdventure &&
        !isFetchingCountries &&
        !isFetchingAddons && (
          <AdventureForm
            adventure={adventure}
            countries={countries}
            addons={addons}
          />
        )}

      <Separator />
      <h2 className="text-2xl text-destructive  font-helveticaNeue font-black  border-s-4 border-destructive ps-2">
        {t("dangerArea")}
      </h2>
      <div>
        {isFetchingAdventure && <Skeleton className="w-full h-20" />}
        {adventure && !isFetchingAdventure && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col grow items-start">
              {adventure && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground font-normal"
                    >
                      {t("deleteAdventure")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="gap-1">
                      <DialogTitle>{t("deleteAdventure")}</DialogTitle>
                      <DialogDescription className="gap-1 flex flex-wrap">
                        {t("areYouSureYouWantToDelete")}
                        <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                          {adventure.title}
                        </span>
                      </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button className="" type="button" variant="ghost">
                          {t("close")}
                        </Button>
                      </DialogClose>
                      <>
                        <Button
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate()}
                          type="button"
                          variant={"destructive"}
                        >
                          {deleteMutation.isPending && (
                            <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                          )}
                          {t("deleteAdventure")}
                        </Button>
                      </>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardSection>
  );
}
