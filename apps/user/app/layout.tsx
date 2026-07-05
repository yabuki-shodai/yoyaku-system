import type { Metadata } from "next";
import { BookingProvider } from "@/lib/booking-context";
import Header from "@/components/headers/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumi. | 渋谷の美容室",
  description:
    "Lumiはあなたの「好き」を一緒に見つける渋谷の美容室です。24時間いつでもオンライン予約できます。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full bg-white antialiased">
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
      <body className="min-h-full flex flex-col bg-white">
        <BookingProvider>
          <Header />
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
