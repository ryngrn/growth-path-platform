import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import '@/styles/globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GrowthPath',
  description: 'Track your child\'s growth and development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <Providers>
          <main className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  );
}
