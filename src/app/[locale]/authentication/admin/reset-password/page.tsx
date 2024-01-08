"use client";

import React from "react";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AdminResetPasswordForm } from "@/components/auth/admin-reset-password-form";

export default function Page() {
  const locale = useLocale();
  const { push } = useRouter();
  const t = useTranslations("Auth");

  return (
    <div>
      <AdminResetPasswordForm />
    </div>
  );
}
