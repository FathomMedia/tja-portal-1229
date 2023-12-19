"use client";

import { getUser } from "@/lib/apiHelpers";
import { TUser } from "@/lib/types";
import { error } from "console";
import { useLocale } from "next-intl";
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface IUseAppContext {
  user: TUser | null;
  token: string | null;
}

const defaultState: IUseAppContext = {
  user: null,
  token: null,
};

const AppContext = createContext<IUseAppContext>(defaultState);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: FC<PropsWithChildren> = ({ children }) => {
  const app = useProviderApp();
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
};

function useProviderApp() {
  const [user, setUser] = useState<TUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const locale = useLocale();

  // useEffect(() => {
  //   async function getToken() {
  //     return await fetch("/api/authentication/get-user-token").then(
  //       async (res) => {
  //         const data = await res.json();

  //         return data.token ? data.token : null;
  //       }
  //     );
  //   }

  //   getToken().then(setToken);

  //   return () => {};
  // }, []);

  // useEffect(() => {
  //   const getCurrentUser = async () => {
  //     return await getUser({ locale });
  //   };
  //   getCurrentUser().then(setUser);

  //   return () => {};
  // }, [locale]);

  // return values
  return {
    user,
    token,
  };
}
