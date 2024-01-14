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
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";
import React from "react";
import { apiReqQuery } from "@/lib/apiHelpers";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isFetching: boolean;
  meta: TMeta | null;
  onPageSelect: (goTo: number) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isFetching,
  meta,
  onPageSelect,
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

  const t = useTranslations("Adventures");
  const locale = useLocale();

  return (
    <div className=" w-full">
      <div className="flex gap-2 justify-end py-2">
        <Button
          variant={"outline"}
          className="ml-auto rounded-lg flex items-center gap-1"
          onClick={() =>
            apiReqQuery({
              endpoint: `/adventure-bookings/export`,
              method: "GET",
              locale,
            }).then(async (res) => {
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "adventure-bookings.csv";
              a.click();
              window.URL.revokeObjectURL(url);
            })
          }
        >
          Download CSV
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
      <div className="rounded-md overflow-clip border">
        <Table className=" w-full">
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

export const TablePagination = ({
  meta,
  onPageSelect,
}: {
  meta: TMeta;
  onPageSelect: (goTo: number) => void;
}) => {
  const locale = useLocale();
  return (
    <div className="flex items-center gap-3 p-2 w-full justify-center">
      {/* first */}
      <Button
        onClick={() => onPageSelect(1)}
        disabled={meta.pagination.current_page === 1}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        {!isRtlLang(locale) && <ChevronsLeft className="h-4 w-4" />}
        {isRtlLang(locale) && <ChevronsRight className="h-4 w-4" />}
      </Button>
      {/* prev */}
      <Button
        onClick={() => onPageSelect(meta.pagination.prev_page_number ?? 1)}
        disabled={!meta.pagination.prev_page_number}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        {!isRtlLang(locale) && <ChevronLeft className="h-4 w-4" />}
        {isRtlLang(locale) && <ChevronRight className="h-4 w-4" />}
        <span className="hidden sm:inline">Previous</span>
      </Button>
      <Select
        onValueChange={(val) => onPageSelect(Number(val))}
        value={meta.current_page.toString()}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Page" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(
            { length: meta.pagination.total_pages },
            (_, i) => i + 1
          ).map((page, i) => (
            <SelectItem key={i} value={page.toString()}>
              {page}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={() =>
          onPageSelect(
            meta.pagination.next_page_number ?? meta.pagination.total_pages
          )
        }
        disabled={!meta.pagination.next_page_number}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        <span className="hidden sm:inline">Next</span>
        {isRtlLang(locale) && <ChevronLeft className="h-4 w-4" />}
        {!isRtlLang(locale) && <ChevronRight className="h-4 w-4" />}
      </Button>
      {/* last */}
      <Button
        onClick={() => onPageSelect(meta.pagination.total_pages)}
        disabled={meta.pagination.current_page === meta.pagination.total_pages}
        className="rounded-sm"
        variant={"ghost"}
        size={"sm"}
      >
        {isRtlLang(locale) && <ChevronsLeft className="h-4 w-4" />}
        {!isRtlLang(locale) && <ChevronsRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};
