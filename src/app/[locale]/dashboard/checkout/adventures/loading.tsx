import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Skeleton className="w-full h-96 rounded-md" />
      <Skeleton className="w-full h-96 rounded-md" />
    </div>
  );
}
