"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Ghost } from "lucide-react";
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

const typeFilters = [
  { value: "", label: "Tất cả" },
  { value: "attack", label: "Tấn công" },
  { value: "crit", label: "Bạo kích" },
  { value: "hp", label: "Sinh mệnh" },
  { value: "defense", label: "Phòng thủ" },
  { value: "speed", label: "Tốc độ" },
  { value: "special", label: "Đặc biệt" },
];

export default function SoulsListClient() {
  const [souls, setSouls] = useState<SoulData[]>([]);
  const [filteredSouls, setFilteredSouls] = useState<SoulData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    const fetchSouls = async () => {
      try {
        setLoading(true);
        const response = await soulApi.getAll();
        setSouls(response?.souls || []);
        setFilteredSouls(response?.souls || []);
      } catch (err) {
        console.error("Failed to fetch souls:", err);
        setError("Không thể tải danh sách Ngự Hồn");
      } finally {
        setLoading(false);
      }
    };

    fetchSouls();
  }, []);

  useEffect(() => {
    let result = souls;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((soul) => soul.name.toLowerCase().includes(searchLower) || soul.nameVi?.toLowerCase().includes(searchLower));
    }

    if (typeFilter) {
      result = result.filter((soul) => soul.type === typeFilter);
    }

    setFilteredSouls(result);
  }, [search, typeFilter, souls]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        <span className="ml-2 text-muted-foreground">Đang tải danh sách Ngự Hồn...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm ngự hồn..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          {typeFilters.map((filter) => (
            <button key={filter.value} onClick={() => setTypeFilter(filter.value)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${typeFilter === filter.value ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-muted-foreground"}`}>
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Hiển thị {filteredSouls.length} / {souls.length} ngự hồn
      </p>

      {/* Souls Grid */}
      {filteredSouls.length === 0 ? (
        <div className="text-center py-12">
          <Ghost className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">Không tìm thấy ngự hồn nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSouls.map((soul) => {
            const typeInfo = soulTypeLabels[soul.type] || {
              label: soul.type,
              color: "text-gray-400",
              bgColor: "bg-gray-500/20 border-gray-500/30",
            };

            return (
              <Link key={soul.id} href={`/wiki/souls/${soul.slug}`}>
                <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden">
                  <div className="flex">
                    {/* Image */}
                    <div className="w-24 h-24 relative bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex-shrink-0">
                      {soul.image ? (
                        <Image src={soul.image} alt={soul.nameVi || soul.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">🔮</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{soul.nameVi || soul.name}</h3>
                          <p className="text-xs text-muted-foreground">{soul.name}</p>
                        </div>
                        <Badge variant="outline" className={`${typeInfo.bgColor} ${typeInfo.color} border`}>
                          {typeInfo.label}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">{soul.effect2pcVi || soul.effect2pc}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
