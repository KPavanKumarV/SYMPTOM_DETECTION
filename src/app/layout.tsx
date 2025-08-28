import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProviderComponent from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Medical Diagnosis Assistant',
  description: 'AI-powered symptom analysis with pattern recognition',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProviderComponent>
          {children}
          <Toaster />
        </ThemeProviderComponent>
      </body>
    </html>
  );
}