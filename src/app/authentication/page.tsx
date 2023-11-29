import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Authentication",
  description: "The Journey Adventures Authentication",
};

export default function Page() {
  async function handleSubmit(formData: FormData) {
    "use server";
  }

  return (
    <div className=" w-full bg-background">
      {/* auth card */}
      <div className="container max-w-md flex flex-col items-center py-6  md:py-20">
        <UserAuthForm />
      </div>
    </div>
  );
}
