"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";
import { SocketProvider } from "./SocketProvider";
import { LazyMotion, domAnimation } from "framer-motion";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryProvider>
        <AuthProvider>
          <SocketProvider>
            <LazyMotion features={domAnimation}>
              {children}
            </LazyMotion>
          </SocketProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
};
