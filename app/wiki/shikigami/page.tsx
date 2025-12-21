import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import ShikigamiListClient from "@/components/wiki/ShikigamiListClient";

export const metadata: Metadata = {
  title: "Danh Sách Thức Thần Onmyoji - Tier List & Build Guide 2024",
  description: "200+ thức thần Onmyoji với chỉ số, kỹ năng, ngự hồn phù hợp. SSR, SP, SR tier list mới nhất. Hướng dẫn build và đội hình meta.",
  keywords: [
    "danh sách thức thần Onmyoji", "tier list thức thần", "shikigami Onmyoji",
    "SSR Onmyoji", "SP Onmyoji", "build thức thần", "thức thần mạnh nhất"
  ],
  openGraph: {
    title: "Danh Sách Thức Thần Onmyoji - Tier List 2024",
    description: "200+ thức thần với chỉ số, kỹ năng và ngự hồn phù hợp",
    images: ["/og-shikigami.png"],
  },
  alternates: {
    canonical: "/wiki/shikigami",
  },
};

export default function ShikigamiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-orange-950/5">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/wiki" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Wiki
          </Link>
          <span>/</span>
          <span className="text-foreground">Thức Thần</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Thức Thần</h1>
              <p className="text-muted-foreground">Danh sách đầy đủ các Thức Thần trong Onmyoji</p>
            </div>
          </div>
        </div>

        {/* Shikigami List */}
        <ShikigamiListClient />
      </div>
    </div>
  );
}
