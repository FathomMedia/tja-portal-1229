import { CustomerOrdersComponent } from "@/components/dashboard/orders/CustomerOrdersComponent";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Home");

  return (
    <div className="p-6 flex flex-col gap-4 max-w-4xl">
      <CustomerOrdersComponent />
    </div>
  );
}
