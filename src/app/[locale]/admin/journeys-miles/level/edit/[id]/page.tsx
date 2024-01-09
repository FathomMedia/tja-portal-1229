"use client";

import { Separator } from "@/components/ui/separator";

import { TAddon, TAdventure, TCountry, TLevel } from "@/lib/types";
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
import { LevelsForm } from "@/components/admin/JourneysMiles/levels/LevelsForm";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Dashboard");
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const { data: level, isFetching: isFetchingLevel } = useQuery<TLevel>({
    queryKey: [`/levels/${id}`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/levels/${id}`, locale }).then((res) =>
        res.json().then((resData) => resData.data)
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/level/delete-level`, {
        method: "POST",
        body: JSON.stringify({
          id: level?.id,
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
        queryClient.invalidateQueries({
          queryKey: [`/levels/${id}`],
        });
        queryClient.invalidateQueries({ queryKey: [`/levels`] });
        toast.success(message);
        push(`/${locale}/admin/journeys-miles?type=levels`);
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
    <div className="max-w-4xl flex flex-col gap-10 pb-20">
      <div>
        <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
          {t("editLevel")}
        </h2>
      </div>
      {isFetchingLevel && <Skeleton className="w-full h-96" />}
      {level && !isFetchingLevel && <LevelsForm level={level} />}

      <Separator />
      <h2 className="text-2xl text-destructive font-helveticaNeue font-black border-s-4 border-destructive ps-2">
        {t("dangerArea")}
      </h2>
      <div>
        {isFetchingLevel && <Skeleton className="w-full h-20" />}
        {level && !isFetchingLevel && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col grow items-start">
              {level && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground font-normal"
                    >
                      {t("deleteLevel")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="gap-1">
                      <DialogTitle>{t("deleteLevel")}</DialogTitle>
                      <DialogDescription className="gap-1 flex flex-wrap">
                        {t("areYouSureYouWantToDelete")}
                        <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                          {level.name}
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
                          {t("deleteLevel")}
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
    </div>
  );
}
