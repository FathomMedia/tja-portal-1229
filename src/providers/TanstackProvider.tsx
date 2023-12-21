"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { FC, PropsWithChildren } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const TanstackProvider: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 60 * 1000,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default TanstackProvider;
