import { cn } from "@/lib/utils";
import React, { FC, PropsWithChildren } from "react";

type TDashboardSection = {
  title: string;
  className?: string;
};

export const DashboardSection: FC<PropsWithChildren<TDashboardSection>> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className="flex flex-col grow gap-4">
      <h2 className="text-2xl text-primary font-helveticaNeue font-black border-s-4 border-primary ps-2">
        {title}
      </h2>
      <div className={cn("grow", className)}>{children}</div>
    </div>
  );
};
