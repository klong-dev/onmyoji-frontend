"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2, Ghost, Sparkles, Swords, Shield, Heart, Zap, Eye } from "lucide-react";
import { shikigamiApi, ShikigamiData } from "@/lib/api";

const rarityColors: Record<string, { bg: string; text: string; gradient: string }> = {
  SP: { bg: "bg-amber-500", text: "text-amber-400", gradient: "from-amber-500/20 to-orange-500/20" },
  SSR: { bg: "bg-purple-500", text: "text-purple-400", gradient: "from-purple-500/20 to-pink-500/20" },
  SR: { bg: "bg-blue-500", text: "text-blue-400", gradient: "from-blue-500/20 to-cyan-500/20" },
  R: { bg: "bg-green-500", text: "text-green-400", gradient: "from-green-500/20 to-emerald-500/20" },
  N: { bg: "bg-gray-500", text: "text-gray-400", gradient: "from-gray-500/20 to-slate-500/20" },
};

const roleLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  DPS: { label: "Sát thương", icon: <Swords className="h-4 w-4" /> },
  Support: { label: "Hỗ trợ", icon: <Sparkles className="h-4 w-4" /> },
  Tank: { label: "Đỡ đòn", icon: <Shield className="h-4 w-4" /> },
  Healer: { label: "Hồi máu", icon: <Heart className="h-4 w-4" /> },
  Control: { label: "Khống chế", icon: <Zap className="h-4 w-4" /> },
  Utility: { label: "Tiện ích", icon: <Sparkles className="h-4 w-4" /> },
};

interface Props {
  slug: string;
}

export default function ShikigamiDetailClient({ slug }: Props) {
  const [shikigami, setShikigami] = useState<ShikigamiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShikigami = async () => {
      try {
        setLoading(true);
        const response = await shikigamiApi.getBySlug(slug);
        setShikigami(response?.shikigami || null);
      } catch (err) {
        console.error("Failed to fetch shikigami:", err);
        setError("Không thể tải thông tin Thức Thần");
      } finally {
        setLoading(false);
      }
    };

    fetchShikigami();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            <span className="ml-2 text-muted-foreground">Đang tải...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !shikigami) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/5">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-24">
            <Ghost className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">Không tìm thấy Thức Thần</h2>
            <p className="text-muted-foreground mb-4">{error || "Thức Thần này không tồn tại"}</p>
            <Link href="/wiki/shikigami" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const rarityStyle = rarityColors[shikigami.rarity] || rarityColors.N;
  const roleInfo = roleLabels[shikigami.role] || { label: shikigami.role, icon: <Sparkles className="h-4 w-4" /> };

  // Calculate stat percentages (assuming max values)
  const maxHp = 15000;
  const maxAtk = 4000;
  const maxDef = 600;
  const maxSpd = 130;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-purple-950/5">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/wiki" className="hover:text-primary transition-colors">
            Wiki
          </Link>
          <span>/</span>
          <Link href="/wiki/shikigami" className="hover:text-primary transition-colors">
            Thức Thần
          </Link>
          <span>/</span>
          <span className="text-foreground">{shikigami.nameVi || shikigami.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Image Card */}
            <Card className="overflow-hidden">
              <div className={`aspect-square relative bg-gradient-to-br ${rarityStyle.gradient}`}>
                {shikigami.image ? (
                  <Image src={shikigami.image} alt={shikigami.nameVi || shikigami.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-8xl">✨</span>
                  </div>
                )}
                {/* Rarity Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${rarityStyle.bg} text-white border-0 text-lg px-3 py-1`}>{shikigami.rarity}</Badge>
                </div>
              </div>
              <CardContent className="p-4 text-center">
                <h1 className="text-2xl font-bold mb-1">{shikigami.nameVi || shikigami.name}</h1>
                <p className="text-muted-foreground mb-3">{shikigami.name}</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {roleInfo.icon}
                    {roleInfo.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lượt xem</span>
                  <span className="font-medium">{shikigami.views || 0}</span>
                </div>
                {shikigami.isFeatured && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Trạng thái</span>
                    <Badge className="bg-purple-500">Nổi bật</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Swords className="h-5 w-5 text-purple-500" />
                  Chỉ số cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* HP */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      HP
                    </span>
                    <span className="font-medium">{shikigami.baseHp || "N/A"}</span>
                  </div>
                  <Progress value={((shikigami.baseHp || 0) / maxHp) * 100} className="h-2" />
                </div>

                {/* ATK */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Swords className="h-4 w-4 text-orange-500" />
                      Tấn công
                    </span>
                    <span className="font-medium">{shikigami.baseAtk || "N/A"}</span>
                  </div>
                  <Progress value={((shikigami.baseAtk || 0) / maxAtk) * 100} className="h-2" />
                </div>

                {/* DEF */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Phòng thủ
                    </span>
                    <span className="font-medium">{shikigami.baseDef || "N/A"}</span>
                  </div>
                  <Progress value={((shikigami.baseDef || 0) / maxDef) * 100} className="h-2" />
                </div>

                {/* SPD */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      Tốc độ
                    </span>
                    <span className="font-medium">{shikigami.baseSpd || "N/A"}</span>
                  </div>
                  <Progress value={((shikigami.baseSpd || 0) / maxSpd) * 100} className="h-2" />
                </div>

                {/* Crit Rate & Crit DMG */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Tỉ lệ bạo kích</p>
                    <p className="text-lg font-bold text-orange-500">{shikigami.baseCritRate ? `${shikigami.baseCritRate}%` : "N/A"}</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Sát thương bạo kích</p>
                    <p className="text-lg font-bold text-red-500">{shikigami.baseCritDmg ? `${shikigami.baseCritDmg}%` : "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description/Lore Card */}
            {(shikigami.description || shikigami.lore) && (
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shikigami.description && <p className="text-muted-foreground leading-relaxed">{shikigami.description}</p>}
                  {shikigami.lore && (
                    <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-purple-500 italic">
                      <p className="text-muted-foreground">{shikigami.lore}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Skills Card */}
            {shikigami.skills && shikigami.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    Kỹ năng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shikigami.skills.map((skill: any, index: number) => (
                    <div key={skill.id || index} className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">{skill.image ? <Image src={skill.image} alt={skill.nameVi || skill.name} width={48} height={48} className="rounded-lg" /> : <Zap className="h-6 w-6 text-purple-500" />}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{skill.nameVi || skill.name}</h4>
                            {skill.type && (
                              <Badge variant="outline" className="text-xs">
                                {skill.type === "passive" && "Bị động"}
                                {skill.type === "active" && "Chủ động"}
                                {skill.type === "normal" && "Thường"}
                                {!["passive", "active", "normal"].includes(skill.type) && skill.type}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{skill.descriptionVi || skill.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recommended Souls */}
            {shikigami.souls && shikigami.souls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Ngự hồn khuyên dùng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {shikigami.souls.map((soul: any) => (
                      <Link key={soul.id} href={`/wiki/souls/${soul.slug}`} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">{soul.image ? <Image src={soul.image} alt={soul.nameVi || soul.name} width={40} height={40} className="rounded-lg" /> : <span className="text-lg">🔮</span>}</div>
                        <div>
                          <p className="font-medium text-sm">{soul.nameVi || soul.name}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link href="/wiki/shikigami" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách Thức Thần
          </Link>
        </div>
      </div>
    </div>
  );
}
