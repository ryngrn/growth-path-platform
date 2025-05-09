import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import SessionProvider from "@/components/providers/SessionProvider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "GrowthPath - Track Your Child's Development",
  description: "A platform for parents to track and support their children's life skills development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider>
          <div className="flex flex-col min-h-screen mt-[10px]">
            <div className="flex flex-col w-full max-w-[390px] max-h-[812px] mx-auto grow rounded-[30px] overflow-hidden">
              <Header />
              <main className="grow pb-6">{children}</main>
              <Footer />
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
