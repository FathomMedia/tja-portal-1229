"use client";

import { TConsultationBooking } from "@/lib/types";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import {
  CheckCircle2,
  ClipboardCopy,
  LucideMinusCircle,
  MoreHorizontal,
  ArrowUpDown,
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
import { useLocale } from "next-intl";
import { DisplayTranslatedText } from "@/components/Helper";

export const columns: ColumnDef<TConsultationBooking>[] = [
  {
    accessorKey: "id",
    header: () => <DisplayTranslatedText text="id" translation="Dashboard" />,
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="Name" translation="SignUp" />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.customer.name}</p>,
  },
  {
    accessorKey: "email",
    header: () => (
      <DisplayTranslatedText text="emailAddress" translation="SignUp" />
    ),
    cell: ({ row }) => {
      return (
        <Button
          variant={"ghost"}
          size={"sm"}
          className="flex items-center gap-1 text-xs w-fit hover:cursor-copy group"
          onClick={() => {
            toast.message("Email copied to your clipboard.", {
              icon: <ClipboardCopy className="w-3 h-3" />,
            });
            navigator.clipboard.writeText(row.original.customer.email);
          }}
        >
          {row.original.customer.email}
          <span>
            <ClipboardCopy className="w-3 h-3 sm:opacity-0 group-hover:opacity-100 duration-100" />
          </span>
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: () => <DisplayTranslatedText text="Phone" translation="SignUp" />,
    cell: ({ row }) => {
      return <p>{row.original.customer.phone}</p>;
    },
  },
  {
    accessorKey: "consultationTier",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="tier" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.consultation.tier}</p>,
  },
  {
    accessorKey: "consultationNumberOfDays",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText
          text="Number of Days"
          translation="Consultation"
        />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.consultation.numberOfDays}</p>,
  },
  // {
  //   accessorKey: "isPaid",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         <DisplayTranslatedText text="isPaid" translation="Consultation" />
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },

  //   cell: ({ row }) => {
  //     return row.original.isPaid ? (
  //       <CheckCircle2 className="text-primary w-5 h-5 mx-auto " />
  //     ) : (
  //       <LucideMinusCircle className="text-destructive w-5 h-5 mx-auto " />
  //     );
  //   },
  // },
  {
    accessorKey: "consultationStartDate",
    header: () => (
      <DisplayTranslatedText text="startDate" translation="Consultation" />
    ),
    cell: ({ row }) => <p>{row.original.startDate}</p>,
  },
  {
    accessorKey: "consultationEndDate",
    header: () => (
      <DisplayTranslatedText text="endDate" translation="Consultation" />
    ),
    cell: ({ row }) => <p>{row.original.endDate}</p>,
  },
  {
    accessorKey: "dateBooked",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="dateBooked" translation="Consultation" />
      </div>
    ),
  },

  {
    accessorKey: "totalPriceWithCurrency",
    header: () => (
      <div className="min-w-[8rem]">
        <DisplayTranslatedText text="price" translation="Consultation" />
      </div>
    ),
    cell: ({ row }) => <p>{row.original.consultation.priceWithCurrency}</p>,
  },
  {
    id: "actions",
    cell: ({ row }) => <Actions consultationBooking={row.original} />,
  },
];

const Actions = ({
  consultationBooking,
}: {
  consultationBooking: TConsultationBooking;
}) => {
  const locale = useLocale();

  // const queryClient = useQueryClient();

  // const mutation = useMutation({
  //   mutationFn: () => {
  //     return fetch(`/api/user/handleSuspend`, {
  //       method: "POST",
  //       body: JSON.stringify({
  //         customerId: customer.customerId,
  //       }),
  //       headers: {
  //         "Accept-Language": locale,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   },
  //   async onSuccess(data) {
  //     if (data.ok) {
  //       const { message } = await data.json();
  //       toast.success(message);
  //       queryClient.invalidateQueries({ queryKey: ["/customers"] });
  //     } else {
  //       const { message } = await data.json();
  //       toast.error(message, { duration: 6000 });
  //     }
  //   },
  //   async onError(error) {
  //     toast.error(error.message, { duration: 6000 });
  //   },
  // });

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
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* <DropdownMenuItem asChild>
            <Link
              href={`/${locale}/admin/customers/edit/${consultationBooking.customer.id}`}
            >
              View Customer
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/${locale}/admin/booking/${consultationBooking.id}`}>
              View Booking
            </Link>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            {
              <Button
                className="text-info w-full rounded-sm bg-info/0 hover:text-info hover:bg-info/10  border-transparent hover:border-transparent"
                variant="outline"
              >
                {/* {mutation.isPending && (
                  <Icons.spinner className="me-2 h-4 w-4 animate-spin" />
                )} */}
                Download Invoice
              </Button>
            }
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
