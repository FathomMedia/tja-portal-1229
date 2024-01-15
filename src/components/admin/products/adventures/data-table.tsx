"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import debounce from "lodash.debounce";
import { TablePagination } from "@/components/TablePagination";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isFetching: boolean;
  meta: TMeta | null;
  onPageSelect: (goTo: number) => void;
  onSearch: (q: string) => void;
  onGender: (gen: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isFetching,
  meta,
  onPageSelect,
  onSearch,
  onGender,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const debouncedResults = useMemo(() => {
    return debounce((e) => onSearch(e.target.value), 300);
  }, [onSearch]);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  const t = useTranslations("Adventures");

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between w-full">
        <Input
          className="max-w-sm rounded-md"
          placeholder={t("search")}
          type="text"
          onChange={debouncedResults}
        />
        {/* Filters */}
        <div className="justify-end">
          <div className="relative">
            <Select onValueChange={onGender}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("gender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">{t("mixed")}</SelectItem>
                <SelectItem value="F">{t("ladiesOnly")}</SelectItem>
                <SelectItem value="M">{t("maleOnly")}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="absolute text-secondary -top-[70%] right-0"
              variant={"ghost"}
              size={"xs"}
              onClick={() => {
                onGender("");
              }}
            >
              {t("clear")}
            </Button>
          </div>
        </div>
      </div>
      <div className="rounded-md overflow-clip border w-full">
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
                        className="last:sticky first:sticky start-0 end-0 last:bg-background first:bg-background first:group-hover/row:bg-muted last:shadow"
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
        <Separator />
        {/* Pagination */}
        {meta && <TablePagination meta={meta} onPageSelect={onPageSelect} />}
      </div>
    </div>
  );
}
