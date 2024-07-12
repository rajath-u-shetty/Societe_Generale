"use client";
import React, { FC, useState } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

interface ProviderProps {
  children: React.ReactNode;
}

const AllProviders: FC<ProviderProps> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
      <QueryClientProvider client={queryClient}>
          {children}
      </QueryClientProvider>
  );
};

export default AllProviders;
