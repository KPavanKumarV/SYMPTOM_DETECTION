"use client";

import { ThemeProvider } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProviderComponent({ children }: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}