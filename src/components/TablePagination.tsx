import { TMeta } from "@/lib/types";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { isRtlLang } from "rtl-detect";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const TablePagination = ({
  meta,
  onPageSelect,
}: {
  meta: TMeta;
  onPageSelect: (goTo: number) => void;
}) => {
  const locale = useLocale();
  const t = useTranslations("Pagination");

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
        <span className="hidden sm:inline">{t("previous")}</span>
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
        <span className="hidden sm:inline">{t("next")}</span>
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
