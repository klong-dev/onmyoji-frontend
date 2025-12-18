"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { shikigamiApi, ShikigamiData } from "@/lib/api";

const rarityColors: Record<string, string> = {
  SSR: "bg-gradient-to-r from-amber-500 to-yellow-400 text-black",
  SP: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  SR: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
  R: "bg-gradient-to-r from-green-500 to-emerald-400 text-white",
  N: "bg-gray-500 text-white",
};

const roleLabels: Record<string, string> = {
  DPS: "Sát thương",
  Support: "Hỗ trợ",
  Tank: "Đỡ đòn",
  Healer: "Hồi máu",
  Control: "Khống chế",
  Utility: "Tiện ích",
};

export function FeaturedShikigamiClient() {
  const [shikigamis, setShikigamis] = useState<ShikigamiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShikigami = async () => {
      try {
        const response = await shikigamiApi.getFeatured();
        setShikigamis(response?.shikigamis || []);
      } catch (err) {
        console.error("Failed to fetch shikigami:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShikigami();
  }, []);

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">Thức Thần Nổi Bật</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden border-border bg-card animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardContent className="p-3 text-center">
                <div className="h-4 w-12 mx-auto mb-1 bg-muted rounded" />
                <div className="h-4 w-20 mx-auto bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (shikigamis.length === 0) {
    return (
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">Thức Thần Nổi Bật</h2>
          <Link href="/wiki/shikigami" className="text-sm text-primary hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <p>Chưa có thức thần nào được thêm vào wiki</p>
          <p className="text-sm mt-1">Hãy đóng góp bài viết đầu tiên!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-foreground">Thức Thần Nổi Bật</h2>
        <Link href="/wiki/shikigami" className="text-sm text-primary hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {shikigamis.map((shiki) => (
          <Link key={shiki.id} href={`/wiki/shikigami/${shiki.slug}`}>
            <Card className="group overflow-hidden border-border bg-card transition-all hover:border-primary hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-muted to-muted/50">
                {shiki.thumbnail || shiki.image ? <Image src={shiki.thumbnail || shiki.image || ""} alt={shiki.nameVi || shiki.name} fill className="object-cover transition-transform group-hover:scale-110" /> : <div className="w-full h-full flex items-center justify-center text-4xl">✨</div>}
              </div>
              <CardContent className="p-3 text-center">
                <Badge className={`mb-1 text-xs ${rarityColors[shiki.rarity] || rarityColors.SSR}`}>{shiki.rarity}</Badge>
                <h3 className="text-sm font-medium text-foreground line-clamp-1">{shiki.nameVi || shiki.name}</h3>
                <p className="text-xs text-muted-foreground">{roleLabels[shiki.role] || shiki.role}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
