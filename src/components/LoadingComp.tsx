import React from "react";
import { Skeleton } from "./ui/skeleton";

export const LoadingComp = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <Skeleton className="w-[100px] h-8 rounded-full" />
      <Skeleton className="w-full h-16 rounded-md" />
      <Skeleton className="w-full h-20 rounded-md" />
    </div>
  );
};
