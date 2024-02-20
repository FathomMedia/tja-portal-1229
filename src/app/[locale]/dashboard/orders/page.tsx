import { CustomerOrdersComponent } from "@/components/dashboard/orders/CustomerOrdersComponent";

export default async function Page() {
  return (
    <div className="p-6 flex flex-col gap-4">
      <CustomerOrdersComponent />
    </div>
  );
}
