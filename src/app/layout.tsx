import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Providers from "@/redux/provider";
import { Toaster } from "sonner";
import { ClientOnly } from "@/components/provider/clientOnly";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "lol-info Web",
  description: "실시간으로 소환사의 정보를 얻어 데이터를 구조화합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="ko">   
      <body className={inter.className}>
        <ClientOnly>
          <Providers>
          <Toaster />
            <main className="w-full h-full">{children}</main>
          </Providers>
        </ClientOnly>
      </body>
    </html>
  );
}
