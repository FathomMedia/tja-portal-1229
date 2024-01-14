"use client";
import { AdventureForm } from "@/components/admin/products/adventures/AdventureForm";
import { Separator } from "@/components/ui/separator";

import {
  TAddon,
  TAdventure,
  TConsultationBooking,
  TCountry,
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
import { ViewConsultationOrderForm } from "@/components/admin/orders/consultation/ViewConsultationOrderForm";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const locale = useLocale();

  const t = useTranslations("Adventures");
  const queryClient = useQueryClient();
  const { push } = useRouter();

  const {
    data: consultationBooking,
    isFetching: isFetchingConsultationBooking,
  } = useQuery<TConsultationBooking>({
    queryKey: [`/consultation-bookings/${id}`],
    queryFn: () =>
      apiReqQuery({ endpoint: `/consultation-bookings/${id}`, locale }).then(
        (res) =>
          res.json().then((resData) => {
            return resData.data;
          })
      ),
  });

  return (
    <div className="max-w-4xl flex flex-col gap-10 pb-20">
      {isFetchingConsultationBooking && <Skeleton className="w-full h-96" />}
      {consultationBooking && (
        <ViewConsultationOrderForm consultationBooking={consultationBooking} />
      )}
    </div>
  );
}
