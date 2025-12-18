"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Ghost, Sparkles, Users, Eye } from "lucide-react";
import { soulApi, SoulData } from "@/lib/api";

const soulTypeLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  attack: { label: "Tấn công", color: "text-red-400", bgColor: "bg-red-500/20 border-red-500/30" },
  crit: { label: "Bạo kích", color: "text-orange-400", bgColor: "bg-orange-500/20 border-orange-500/30" },
  hp: { label: "Sinh mệnh", color: "text-green-400", bgColor: "bg-green-500/20 border-green-500/30" },
  defense: { label: "Phòng thủ", color: "text-blue-400", bgColor: "bg-blue-500/20 border-blue-500/30" },
  speed: { label: "Tốc độ", color: "text-cyan-400", bgColor: "bg-cyan-500/20 border-cyan-500/30" },
  effect_hit: { label: "Hiệu quả", color: "text-purple-400", bgColor: "bg-purple-500/20 border-purple-500/30" },
  effect_res: { label: "Kháng", color: "text-teal-400", bgColor: "bg-teal-500/20 border-teal-500/30" },
  special: { label: "Đặc biệt", color: "text-amber-400", bgColor: "bg-amber-500/20 border-amber-500/30" },
};

interface Props {
  slug: string;
}

export default function SoulDetailClient({ slug }: Props) {
  const [soul, setSoul] = useState<SoulData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoul = async () => {
      try {
        setLoading(true);
        const response = await soulApi.getBySlug(slug);
        setSoul(response?.soul || null);
      } catch (err) {
        console.error("Failed to fetch soul:", err);
        setError("Không thể tải thông tin Ngự Hồn");
      } finally {
        setLoading(false);
      }
    };

    fetchSoul();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-orange-950/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-muted-foreground">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !soul) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-orange-950/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-24">
            <Ghost className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy Ngự Hồn</h2>
            <p className="text-muted-foreground mb-4">{error || "Ngự Hồn này không tồn tại"}</p>
            <Link href="/wiki/souls" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const typeInfo = soulTypeLabels[soul.type] || {
    label: soul.type,
    color: "text-gray-400",
    bgColor: "bg-gray-500/20 border-gray-500/30",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-orange-950/5">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/wiki" className="hover:text-primary transition-colors">
            Wiki
          </Link>
          <span>/</span>
          <Link href="/wiki/souls" className="hover:text-primary transition-colors">
            Ngự Hồn
          </Link>
          <span>/</span>
          <span className="text-foreground">{soul.nameVi || soul.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Card */}
            <Card className="overflow-hidden">
              <div className="aspect-square relative bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                {soul.image ? (
                  <Image src={soul.image} alt={soul.nameVi || soul.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">🔮</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-1">{soul.nameVi || soul.name}</h1>
                <p className="text-muted-foreground mb-3">{soul.name}</p>
                <Badge variant="outline" className={`${typeInfo.bgColor} ${typeInfo.color} border text-sm px-3 py-1`}>
                  {typeInfo.label}
                </Badge>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-orange-500" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lượt xem</span>
                  <span className="font-medium">{soul.views || 0}</span>
                </div>
                {soul.isFeatured && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <Badge className="bg-orange-500">Nổi bật</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Effects Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  Hiệu ứng bộ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 2-piece effect */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-orange-500/20 border-orange-500/30 text-orange-400">
                      2 mảnh
                    </Badge>
                  </div>
                  <p className="text-lg font-medium">{soul.effect2pcVi || soul.effect2pc}</p>
                  {soul.effect2pcVi && soul.effect2pc && <p className="text-sm text-muted-foreground mt-1 italic">{soul.effect2pc}</p>}
                </div>

                {/* 4-piece effect */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-amber-500/20 border-amber-500/30 text-amber-400">
                      4 mảnh
                    </Badge>
                  </div>
                  <p className="text-lg font-medium">{soul.effect4pcVi || soul.effect4pc}</p>
                  {soul.effect4pcVi && soul.effect4pc && <p className="text-sm text-muted-foreground mt-1 italic">{soul.effect4pc}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            {soul.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{soul.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Recommended Shikigami */}
            {soul.recommendedShikigami && soul.recommendedShikigami.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    Thức thần phù hợp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {soul.recommendedShikigami.map((shiki: any) => (
                      <Link key={shiki.id} href={`/wiki/shikigami/${shiki.slug}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">{shiki.thumbnail ? <Image src={shiki.thumbnail} alt={shiki.nameVi || shiki.name} width={40} height={40} className="rounded-lg" /> : <span className="text-lg">✨</span>}</div>
                        <div>
                          <p className="font-medium text-sm">{shiki.nameVi || shiki.name}</p>
                          <p className="text-xs text-muted-foreground">{shiki.rarity}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommended For (from JSON field) */}
            {soul.recommendedFor && soul.recommendedFor.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    Phù hợp với
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {soul.recommendedFor.map((role: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {role === "DPS" && "Sát thương"}
                        {role === "Support" && "Hỗ trợ"}
                        {role === "Tank" && "Đỡ đòn"}
                        {role === "Healer" && "Hồi máu"}
                        {role === "Control" && "Khống chế"}
                        {!["DPS", "Support", "Tank", "Healer", "Control"].includes(role) && role}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link href="/wiki/souls" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách Ngự Hồn
          </Link>
        </div>
      </div>
    </div>
  );
}
