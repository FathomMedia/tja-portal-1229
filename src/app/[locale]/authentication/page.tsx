import { Metadata } from "next";

import { UserAuthForm } from "@/components/auth/user-auth-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "The Journey Adventures Authentication",
};

export default async function Page() {
  return (
    <div className=" w-full bg-background">
      {/* auth card */}
      <div className="container flex flex-col items-center py-6  md:py-20">
        <UserAuthForm />
      </div>
    </div>
  );
}
