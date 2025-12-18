"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, Ghost } from "lucide-react";
import { soulApi, SoulData } from "@/lib/api";

export default function FeaturedSoulsClient() {
  const [souls, setSouls] = useState<SoulData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedSouls = async () => {
      try {
        setLoading(true);
        const response = await soulApi.getFeatured();
        setSouls(response?.souls || []);
      } catch (err) {
        console.error("Failed to fetch featured souls:", err);
        setError("Không thể tải danh sách Ngự Hồn");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedSouls();
  }, []);

  // Soul type Vietnamese translations
  const soulTypeLabels: Record<string, { label: string; color: string }> = {
    attack: { label: "Tấn công", color: "bg-red-500" },
    crit: { label: "Bạo kích", color: "bg-orange-500" },
    hp: { label: "Sinh mệnh", color: "bg-green-500" },
    def: { label: "Phòng thủ", color: "bg-blue-500" },
    effect_hit: { label: "Hiệu quả", color: "bg-purple-500" },
    effect_res: { label: "Kháng hiệu quả", color: "bg-teal-500" },
    special: { label: "Đặc biệt", color: "bg-amber-500" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-muted-foreground">Đang tải Ngự Hồn nổi bật...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (souls.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Ghost className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Chưa có Ngự Hồn nổi bật nào</p>
      </div>
    );
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center">
          <Sparkles className="mr-2 h-6 w-6 text-purple-500" />
          Ngự Hồn Nổi Bật
        </h2>
        <Link href="/wiki/souls" className="text-sm text-orange-500 hover:underline">
          Xem tất cả →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {souls.map((soul) => {
          const typeInfo = soulTypeLabels[soul.type] || { label: soul.type, color: "bg-gray-500" };

          return (
            <Link key={soul.id} href={`/wiki/souls/${soul.slug}`}>
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-purple-200 hover:border-purple-400 h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{soul.nameVi || soul.name}</CardTitle>
                    <Badge className={`${typeInfo.color} text-white`}>{typeInfo.label}</Badge>
                  </div>
                  {soul.name !== soul.nameVi && <p className="text-sm text-muted-foreground">{soul.name}</p>}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-purple-600">2 mảnh:</span>
                      <p className="text-muted-foreground line-clamp-2">{soul.effect2pcVi || soul.effect2pc}</p>
                    </div>
                    <div>
                      <span className="font-medium text-purple-600">4 mảnh:</span>
                      <p className="text-muted-foreground line-clamp-2">{soul.effect4pcVi || soul.effect4pc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
