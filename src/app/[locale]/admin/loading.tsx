import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-[100px] h-8 rounded-full" />
      <Skeleton className="w-full h-16 rounded-md" />
      <Skeleton className="w-full h-20 rounded-md" />
    </div>
  );
}
