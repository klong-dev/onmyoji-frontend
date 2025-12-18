"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Ghost } from "lucide-react";
import { shikigamiApi, ShikigamiData } from "@/lib/api";

const rarityColors: Record<string, { bg: string; text: string; border: string }> = {
  SP: { bg: "bg-gradient-to-r from-amber-500 to-orange-500", text: "text-white", border: "border-amber-400" },
  SSR: { bg: "bg-gradient-to-r from-purple-500 to-pink-500", text: "text-white", border: "border-purple-400" },
  SR: { bg: "bg-gradient-to-r from-blue-500 to-cyan-500", text: "text-white", border: "border-blue-400" },
  R: { bg: "bg-gradient-to-r from-green-500 to-emerald-500", text: "text-white", border: "border-green-400" },
  N: { bg: "bg-gradient-to-r from-gray-500 to-slate-500", text: "text-white", border: "border-gray-400" },
};

const roleLabels: Record<string, string> = {
  DPS: "Sát thương",
  Support: "Hỗ trợ",
  Tank: "Đỡ đòn",
  Healer: "Hồi máu",
  Control: "Khống chế",
  Utility: "Tiện ích",
};

const rarityFilters = ["", "SP", "SSR", "SR", "R", "N"];
const roleFilters = ["", "DPS", "Support", "Tank", "Healer", "Control", "Utility"];

export default function ShikigamiListClient() {
  const [shikigamis, setShikigamis] = useState<ShikigamiData[]>([]);
  const [filteredShikigamis, setFilteredShikigamis] = useState<ShikigamiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rarityFilter, setRarityFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    const fetchShikigamis = async () => {
      try {
        setLoading(true);
        const response = await shikigamiApi.getAll();
        setShikigamis(response?.shikigamis || []);
        setFilteredShikigamis(response?.shikigamis || []);
      } catch (err) {
        console.error("Failed to fetch shikigamis:", err);
        setError("Không thể tải danh sách Thức Thần");
      } finally {
        setLoading(false);
      }
    };

    fetchShikigamis();
  }, []);

  useEffect(() => {
    let result = shikigamis;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((shiki) => shiki.name.toLowerCase().includes(searchLower) || shiki.nameVi?.toLowerCase().includes(searchLower));
    }

    if (rarityFilter) {
      result = result.filter((shiki) => shiki.rarity === rarityFilter);
    }

    if (roleFilter) {
      result = result.filter((shiki) => shiki.role === roleFilter);
    }

    setFilteredShikigamis(result);
  }, [search, rarityFilter, roleFilter, shikigamis]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        <span className="ml-2 text-muted-foreground">Đang tải danh sách Thức Thần...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm thức thần..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        {/* Rarity Filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Độ hiếm</p>
          <div className="flex flex-wrap gap-2">
            {rarityFilters.map((rarity) => (
              <button key={rarity || "all"} onClick={() => setRarityFilter(rarity)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${rarityFilter === rarity ? (rarity ? `${rarityColors[rarity]?.bg} ${rarityColors[rarity]?.text}` : "bg-primary text-primary-foreground") : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}>
                {rarity || "Tất cả"}
              </button>
            ))}
          </div>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Vai trò</p>
          <div className="flex flex-wrap gap-2">
            {roleFilters.map((role) => (
              <button key={role || "all"} onClick={() => setRoleFilter(role)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${roleFilter === role ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}>
                {role ? roleLabels[role] || role : "Tất cả"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Hiển thị {filteredShikigamis.length} / {shikigamis.length} thức thần
      </p>

      {/* Shikigami Grid */}
      {filteredShikigamis.length === 0 ? (
        <div className="text-center py-12">
          <Ghost className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">Không tìm thấy thức thần nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredShikigamis.map((shiki) => {
            const rarityStyle = rarityColors[shiki.rarity] || rarityColors.N;

            return (
              <Link key={shiki.id} href={`/wiki/shikigami/${shiki.slug}`}>
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden">
                  {/* Image */}
                  <div className="aspect-square relative bg-gradient-to-br from-purple-500/10 to-pink-500/10">
                    {shiki.thumbnail || shiki.image ? (
                      <Image src={shiki.thumbnail || shiki.image || ""} alt={shiki.nameVi || shiki.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl">✨</span>
                      </div>
                    )}
                    {/* Rarity Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`${rarityStyle.bg} ${rarityStyle.text} border-0`}>{shiki.rarity}</Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-3 text-center">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">{shiki.nameVi || shiki.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">{shiki.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{roleLabels[shiki.role] || shiki.role}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
