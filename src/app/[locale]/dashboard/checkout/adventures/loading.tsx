import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      {/* Billing Info */}
      <div className="order-2 lg:order-1 bg-background text-foreground p-4">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full" />
        </div>
      </div>
      {/* Checkout choices */}
      <div className="order-1 lg:order-2 bg-primary rounded-xl text-primary-foreground p-4">
        <div className="flex flex-col @xl:flex-row items-start gap-6">
          <div className="relative aspect-[13/5] @xl:aspect-square w-full @xl:w-1/4 rounded-lg overflow-clip">
            <Skeleton className="w-full h-full" />
          </div>
          {/* Adventure info */}
          <div className="w-full flex flex-col justify-between space-y-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between item-center">
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="w-20 h-5 rounded-full" />
                  <Skeleton className="w-20 h-5 rounded-full" />
                  <Skeleton className="w-20 h-5 rounded-full" />
                </div>
              </div>
              <Skeleton className="w-3/4 h-10 rounded-full" />
              <Skeleton className="w-full h-40 rounded-lg" />
            </div>
            <Skeleton className="w-3/4 h-5 rounded-full" />

            <Skeleton className="w-1/5 h-5 rounded-full" />
            <Skeleton className="w-1/5 h-5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
