"use client";

import { Button } from "@/components/ui/button";
import { apiReq } from "@/lib/utils";
import { useLocale, useMessages, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import toast, { useToaster } from "react-hot-toast";

export default function Index() {
  const locale = useLocale();
  const { refresh } = useRouter();

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    async function getUser() {
      const res = await fetch("/api/user/get-user", {
        headers: {
          "Accept-Language": locale,
        },
      }).then(async (res) => await res.json());

      const user = res.data;
      setUser(user);
    }

    getUser();

    return () => {};
  }, [locale]);

  const t = useTranslations("Home");

  async function LogOut() {
    const res = await fetch("/api/authentication/logout", {
      headers: {
        "Accept-Language": locale,
      },
    });
    const data = await res.json();
    console.log(res.status);
    if (res.ok) {
      toast.success(data.message);
      refresh();
    } else {
      toast.error(data.message);
    }
  }

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="bg-muted flex p-3 rounded-full justify-end">
        <Button onClick={LogOut}>{t("logout")}</Button>
      </div>
      <div className="p-6 bg-primary text-primary-foreground rounded-md flex flex-col gap-2">
        <div>{user?.name}</div>
        <div>{user?.email}</div>
        <div>{user?.phone}</div>
        <div>{user?.level}</div>
        <div>{user?.points}</div>
        <div>{user?.age}</div>
        <div>{user?.daysTravelled}</div>
        <div>{user?.gender}</div>
        <div>{user?.dateOfBirth}</div>
        <div>{user?.joinedAt}</div>
      </div>
    </div>
  );
}
