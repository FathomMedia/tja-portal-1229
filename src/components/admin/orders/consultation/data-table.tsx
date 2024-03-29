"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import { TMeta } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
} from "lucide-react";
import { isRtlLang } from "rtl-detect";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useMemo, useState } from "react";
import React from "react";
import { apiReqQuery } from "@/lib/apiHelpers";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import { TablePagination } from "@/components/TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isFetching: boolean;
  meta: TMeta | null;
  onPageSelect: (goTo: number) => void;
  onSearch: (q: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isFetching,
  meta,
  onPageSelect,
  onSearch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  const t = useTranslations("Consultation");
  const locale = useLocale();

  const debouncedResults = useMemo(() => {
    return debounce((e) => onSearch(e.target.value), 300);
  }, [onSearch]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <div className=" w-full">
      <div className="flex items-center justify-between gap-2">
        <Input
          className="max-w-sm rounded-md"
          placeholder={t("searchCustomer")}
          type="text"
          onChange={debouncedResults}
        />
        <div className="flex gap-2 justify-end py-2">
          <Button
            variant={"outline"}
            className="ml-auto rounded-lg flex items-center gap-1"
            onClick={() =>
              apiReqQuery({
                endpoint: `/consultation-bookings/export`,
                method: "GET",
                locale,
              }).then(async (res) => {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "consultation-bookings.csv";
                a.click();
                window.URL.revokeObjectURL(url);
              })
            }
          >
            <span className="hidden sm:inline-block">{t("download")}</span>
            <span className="">{"CSV"}</span>
            <span>
              <Download className="w-4 h-4" />
            </span>
          </Button>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto rounded-lg">
                  {t("columns")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value: any) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {t(column.id)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="rounded-md overflow-clip border">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="text-start first:sticky last:sticky end-0 start-0 bg-background"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFetching && (
              <>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    <Skeleton className=" w-full h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    <Skeleton className=" w-full h-full" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    <Skeleton className=" w-full h-full" />
                  </TableCell>
                </TableRow>
              </>
            )}
            {!isFetching && table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="group"
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="last:sticky first:sticky start-0 end-0 bg-background last:shadow"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : !isFetching && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {t("nothingFound")}
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <Separator />
      {/* Pagination */}
      {meta && <TablePagination meta={meta} onPageSelect={onPageSelect} />}
    </div>
  );
}
