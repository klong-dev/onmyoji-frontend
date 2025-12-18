import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WikiArticlesClient } from "@/components/wiki-articles-client";
import { ContributeWikiModal } from "@/components/contribute-wiki-modal";
import { FeaturedShikigamiClient } from "@/components/featured-shikigami-client";
import FeaturedSoulsClient from "@/components/wiki/FeaturedSoulsClient";

export const metadata: Metadata = {
  title: "Wiki - Onmyoji AutoVN",
  description: "Thư viện kiến thức đầy đủ về Onmyoji. Tìm hiểu về thức thần, ngự hồn, đội hình và chiến thuật.",
  openGraph: {
    title: "Wiki Onmyoji AutoVN",
    description: "Thư viện kiến thức đầy đủ về Onmyoji",
  },
};

const wikiCategories = [
  {
    id: "shikigami",
    name: "Thức Thần",
    icon: "✨",
    description: "Danh sách và thông tin chi tiết tất cả thức thần",
  },
  {
    id: "soul",
    name: "Ngự Hồn",
    icon: "💠",
    description: "Danh sách và thông tin chi tiết về ngự hồn",
  },
  {
    id: "skill",
    name: "Kỹ Năng",
    icon: "⚡",
    description: "Hướng dẫn về các kỹ năng và cách sử dụng",
  },
  {
    id: "guide",
    name: "Hướng Dẫn",
    icon: "📖",
    description: "Các hướng dẫn chi tiết cho người chơi",
  },
  {
    id: "event",
    name: "Sự Kiện",
    icon: "🎉",
    description: "Thông tin về các sự kiện trong game",
  },
];

export default function WikiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Wiki Onmyoji</h1>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Thư viện kiến thức đầy đủ về thức thần, ngự hồn, đội hình và chiến thuật</p>
          </div>
          <div className="flex-1 flex justify-end">
            <ContributeWikiModal />
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto mt-6 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <Input placeholder="Tìm kiếm wiki..." className="pl-10" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wikiCategories.map((cat) => {
          // Map category to correct route
          const href = cat.id === "shikigami" ? "/wiki/shikigami" : cat.id === "soul" ? "/wiki/souls" : `/wiki?category=${cat.id}`;

          return (
            <Link key={cat.id} href={href}>
              <Card className="group border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 h-full">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl transition-colors group-hover:bg-primary">{cat.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{cat.name}</h3>
                    <p className="text-sm text-muted-foreground">{cat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Featured Shikigami - Client Component */}
      <FeaturedShikigamiClient />

      {/* Featured Souls - Client Component */}
      <FeaturedSoulsClient />

      {/* Recent Articles - Client Component */}
      <WikiArticlesClient />
    </div>
  );
}
