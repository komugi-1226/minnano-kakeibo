import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/app/providers";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "みんなの家計簿 | 家計管理アプリ",
  description: "家計の収支を簡単に管理できるアプリです。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="container mx-auto text-center text-sm text-muted-foreground">
                &copy; 2024 みんなの家計簿
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}