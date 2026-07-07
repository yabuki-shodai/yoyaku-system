import type { Metadata } from "next";
import { AdminProvider } from "@/lib/admin-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumi Admin",
  description: "美容院予約 管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-[#eef0f2] text-[#1f2328] [font-family:'Zen_Kaku_Gothic_New',system-ui,sans-serif]">
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
