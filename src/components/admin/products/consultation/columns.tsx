"use client";

import { TConsultation } from "@/lib/types";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle2,
  ClipboardCopy,
  LucideMinusCircle,
  MoreHorizontal,
  ArrowUpDown,
  Calendar,
  CalendarIcon,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { isRtlLang } from "rtl-detect";
import { Input } from "@/components/ui/input";
import { apiReqQuery } from "@/lib/apiHelpers";
import { useQuery } from "@tanstack/react-query";
import { CreateConsultationForm } from "./CreateConsultationForm";

type TEditConsultation = {
  tier: string;
  numOfDays: number;
  price: number;
};

export const columns: ColumnDef<TConsultation>[] = [
  {
    accessorKey: "id",
    header: () => (
      <DisplayTranslatedText text="id" translation="Consultation" />
    ),
  },
  {
    accessorKey: "tierType",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="tier" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => {
      return <Badge variant={"outline"}>{row.original.tier}</Badge>;
    },
  },
  {
    accessorKey: "numberOfDays",
    header: () => (
      <DisplayTranslatedText text="No. of Days" translation="Consultation" />
    ),
    cell: ({ row }) => {
      return <p className=" text-center">{row.original.numberOfDays}</p>;
    },
  },
  {
    accessorKey: "price",
    header: () => (
      <DisplayTranslatedText text="Price" translation="Consultation" />
    ),
    cell: ({ row }) => {
      return <p className=" text-center">{row.original.priceWithCurrency}</p>;
    },
  },
  {
    id: "actions",
    header: () => <AddNew />,
    cell: ({ row }) => <Actions consultation={row.original} />,
  },
];

export const AddNew = () => {
  const locale = useLocale();
  return (
    <div className="flex flex-col items-center text-blue-500 text-xs gap-1 hover:bg-muted p-1 rounded-sm duration-100">
      <PlusCircle className="w-4 h-4" />
      {/* onClick={() => CreateConsultationForm()} */}
      <DisplayTranslatedText text="add" translation="Consultation" />
    </div>
  );
};

const Actions = ({ consultation }: { consultation: TConsultation }) => {
  const locale = useLocale();
  const t = useTranslations("Consultation");

  const formSchema = z.object({
    tier: z.string().min(1, "Please select a tier"),
    numOfDays: z.number(),
    price: z.number(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      //TODO take the values of the consultation package
    },
  });

  // const queryClient = useQueryClient();
  // const mutation = useMutation({
  //   mutationFn: (values: z.infer<typeof formSchema>) => {
  //     return fetch("/api/consultation", {
  //       method: "POST",
  //       headers: {
  //         "Accept-Language": locale,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         tier: values.package,
  //         start_date: format(values.start_date, "dd/MM/yyyy"),
  //         end_date: format(values.end_date, "dd/MM/yyyy"),
  //       }),
  //     });
  //   },
  //   async onSuccess(data, values) {
  //     const { message, data: dataResponse } = await data.json();
  //     if (data.ok) {
  //       console.log(
  //         "🚀 ~ file: CalculateConsultation.tsx:95 ~ onSuccess ~ dataResponse:",
  //         dataResponse
  //       );
  //       toast.success(message, { duration: 6000 });
  //       onPackageChanged(dataResponse);
  //       startDate(values.start_date);
  //       endDate(values.end_date);
  //       setTotalFullPrice(dataResponse.priceWithCurrency ?? null);
  //     } else {
  //       toast.error(message, { duration: 6000 });
  //     }
  //   },
  //   async onError(error) {
  //     toast.error(error.message, { duration: 6000 });
  //   },
  // });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // mutation.mutate(values);
    console.log(values);
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            {
              <Dialog>
                <DialogTrigger className="w-full rounded-sm bg-info/0 hover:text-info hover:bg-info/10  border-transparent hover:border-transparent">
                  Edit
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className=" text-primary text-xl">
                      Edit consultation details
                    </DialogTitle>
                    <DialogDescription>
                      {
                        "Make changes to the consultation package here. Click save to update the information."
                      }
                    </DialogDescription>
                  </DialogHeader>
                  {/* <CreateConsultationForm /> */}
                </DialogContent>
              </Dialog>
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
