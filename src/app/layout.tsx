import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { store } from "@/redux/store";
import Providers from "@/redux/provider";
import { Toaster } from "sonner";

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
      <Providers>
        <Toaster />
        <body className={inter.className}>{children}</body>
      </Providers>
    </html>
  );
}
