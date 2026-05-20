'use client';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/toast';
import { Suspense } from 'react';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="zakir-theme"
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <AppProviders>{children}</AppProviders>
    </Suspense>
  );
}
