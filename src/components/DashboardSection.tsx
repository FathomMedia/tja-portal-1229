"use client";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import React, { FC, PropsWithChildren } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

type TDashboardSection = {
  title: string;
  className?: string;
  hideBack?: boolean;
};

export const DashboardSection: FC<PropsWithChildren<TDashboardSection>> = ({
  title,
  children,
  className,
  hideBack,
}) => {
  const { back } = useRouter();
  return (
    <div className="flex flex-col grow gap-4">
      <div className=" flex gap-1 items-center">
        {!hideBack && (
          <Button variant={"outline"} size={"icon"} onClick={back}>
            <ChevronLeft className="text-primary rtl:rotate-180" />
          </Button>
        )}
        <h2 className="text-2xl pt-2 text-primary font-helveticaNeue font-black border-primary ps-2">
          {title}
        </h2>
      </div>
      <div className={cn("grow ", className)}>{children}</div>
    </div>
  );
};
