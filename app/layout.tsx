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
    default: "OnmyojiAutoVN - Tool Auto Onmyoji Miễn Phí #1 Việt Nam",
    template: "%s | OnmyojiAutoVN",
  },
  description: "Tải tool auto Onmyoji miễn phí. Farm tự động Orochi, Soul. Wiki thức thần, ngự hồn tiếng Việt đầy đủ. Cộng đồng 10,000+ người chơi Âm Dương Sư.",
  keywords: [
    "Onmyoji auto", "tool Onmyoji", "Âm Dương Sư auto", "auto farm Onmyoji",
    "script Onmyoji", "Onmyoji Việt Nam", "tool tự động Onmyoji", 
    "auto clicker Onmyoji", "farm Orochi auto", "thức thần Onmyoji",
    "ngự hồn Onmyoji", "wiki Onmyoji tiếng Việt", "shikigami Onmyoji",
    "download Onmyoji auto", "tải tool Onmyoji"
  ],
  authors: [{ name: "OnmyojiAutoVN Team" }],
  creator: "OnmyojiAutoVN",
  metadataBase: new URL("https://onmyojivn.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://onmyojivn.site",
    siteName: "OnmyojiAutoVN",
    title: "OnmyojiAutoVN - Tool Auto Onmyoji Miễn Phí #1 Việt Nam",
    description: "Tải tool auto Onmyoji miễn phí. Wiki thức thần, ngự hồn tiếng Việt đầy đủ nhất.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OnmyojiAutoVN - Tool Auto Onmyoji",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnmyojiAutoVN - Tool Auto Onmyoji Miễn Phí",
    description: "Cộng đồng Auto Script Onmyoji lớn nhất Việt Nam",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // TODO: Add actual code
  },
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
