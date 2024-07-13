"use client";
import React, { FC, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

interface ProviderProps {
  children: React.ReactNode;
}

const AllProviders: FC<ProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default AllProviders;
