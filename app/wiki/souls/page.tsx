import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles } from "lucide-react";
import SoulsListClient from "@/components/wiki/SoulsListClient";

export const metadata: Metadata = {
  title: "Ngự Hồn Onmyoji - Hiệu Ứng 2 4 Mảnh & Build Guide",
  description: "100+ ngự hồn Onmyoji với hiệu ứng 2 mảnh, 4 mảnh. Seductress, Fortune Cat, Shadow, Watcher và nhiều set khác. Thức thần phù hợp từng loại.",
  keywords: [
    "ngự hồn Onmyoji", "soul Onmyoji", "hiệu ứng ngự hồn", "build ngự hồn",
    "Seductress Onmyoji", "Fortune Cat", "ngự hồn tốt nhất", "ngự hồn meta"
  ],
  openGraph: {
    title: "Ngự Hồn Onmyoji - Hiệu Ứng & Build Guide",
    description: "100+ ngự hồn với hiệu ứng và thức thần phù hợp",
    images: ["/og-souls.png"],
  },
  alternates: {
    canonical: "/wiki/souls",
  },
};

export default function SoulsPage() {
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
          <span className="text-foreground">Ngự Hồn</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ngự Hồn</h1>
              <p className="text-muted-foreground">Danh sách đầy đủ các Ngự Hồn trong Onmyoji</p>
            </div>
          </div>
        </div>

        {/* Souls List */}
        <SoulsListClient />
      </div>
    </div>
  );
}
