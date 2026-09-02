"use client";

import { QueryClient, QueryClientProvider as Provider } from '@tanstack/react-query';
import React, { useState } from 'react';

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <Provider client={queryClient}>
      {children}
    </Provider>
  );
};
