"use client";

import { Separator } from "@/components/ui/separator";

import {
  TAddon,
  TAdventure,
  TCountry,
  TAchievement,
  TAchievements,
} from "@/lib/types";
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

import { AchievementsForm } from "@/components/admin/achievements/AchievementsForm";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Dashboard");
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const { data: achievement, isFetching: isFetchingAchievement } =
    useQuery<TAchievement>({
      queryKey: [`/achievements/${id}`],
      queryFn: () =>
        apiReqQuery({ endpoint: `/achievements/${id}`, locale }).then((res) =>
          res.json().then((resData) => resData.data)
        ),
    });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return fetch(`/api/achievement/delete-achievement`, {
        method: "POST",
        body: JSON.stringify({
          id: achievement?.id,
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
          queryKey: [`/achievements/${id}`],
        });
        queryClient.invalidateQueries({ queryKey: [`/achievements`] });
        toast.success(message);
        push(`/${locale}/admin/achievements`);
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
        <h2 className="text-2xl text-primary font-semibold border-s-4 border-primary ps-2">
          {t("editAchievement")}
        </h2>
      </div>
      {isFetchingAchievement && <Skeleton className="w-full h-96" />}
      {achievement && !isFetchingAchievement && (
        <AchievementsForm achievement={achievement} />
      )}

      <Separator />
      <h2 className="text-2xl text-destructive font-semibold border-s-4 border-destructive ps-2">
        {t("dangerArea")}
      </h2>
      <div>
        {isFetchingAchievement && <Skeleton className="w-full h-20" />}
        {achievement && !isFetchingAchievement && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col grow items-start">
              {achievement && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground font-normal"
                    >
                      {t("deleteAchievement")}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader className="gap-1">
                      <DialogTitle>{t("deleteAchievement")}</DialogTitle>
                      <DialogDescription className="gap-1 flex flex-wrap">
                        {t("areYouSureYouWantToDelete")}
                        <span className="bg-muted text-muted-foreground w-fit text-xs p-1 rounded-sm">
                          {achievement.title}
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
                          {t("deleteAchievement")}
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
