import type React from "react";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatFloatingButton } from "@/components/chat-floating-button";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-noto-serif",
});

export const metadata: Metadata = {
  title: {
    default: "OnmyojiAutoVN - Cộng đồng Auto Script Onmyoji",
    template: "%s | OnmyojiAutoVN",
  },
  description: "Nền tảng cộng đồng dành cho người chơi Onmyoji sử dụng auto script. Tải tool, hướng dẫn, diễn đàn thảo luận và wiki.",
  keywords: ["Onmyoji", "auto script", "game tool", "Âm Dương Sư", "shikigami", "yokai"],
  authors: [{ name: "OnmyojiAutoVN Team" }],
  creator: "OnmyojiAutoVN",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://onmyojiautovn.com",
    siteName: "OnmyojiAutoVN",
    title: "OnmyojiAutoVN - Cộng đồng Auto Script Onmyoji",
    description: "Nền tảng cộng đồng dành cho người chơi Onmyoji sử dụng auto script.",
  },
  twitter: {
    card: "summary_large_image",
    title: "OnmyojiAutoVN",
    description: "Cộng đồng Auto Script Onmyoji",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: "v0.app",
};

export const viewport: Viewport = {
  themeColor: "#e94560",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <div className="fixed inset-0 pattern-overlay pointer-events-none" />
          <Navbar />
          <main className="flex-1 relative">{children}</main>
          <Footer />
          <ChatFloatingButton />
        </AuthProvider>
      </body>
    </html>
  );
}
