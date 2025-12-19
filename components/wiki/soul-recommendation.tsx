"use client"

import Link from "next/link"
import type { SoulData } from "@/lib/api"

interface SoulRecommendationProps {
  souls: SoulData[]
}

export function SoulRecommendation({ souls }: SoulRecommendationProps) {
  if (!souls || souls.length === 0) return null

  const soulTypeColors = {
    attack: "from-red-600 to-orange-600",
    crit: "from-yellow-600 to-amber-600",
    hp: "from-green-600 to-emerald-600",
    def: "from-blue-600 to-cyan-600",
    effect_hit: "from-purple-600 to-violet-600",
    effect_res: "from-pink-600 to-rose-600",
    special: "from-indigo-600 to-purple-600",
  }

  const soulTypeLabels = {
    attack: "Tấn công",
    crit: "Bạo kích",
    hp: "Sinh lực",
    def: "Phòng thủ",
    effect_hit: "Hiệu ứng",
    effect_res: "Kháng hiệu ứng",
    special: "Đặc biệt",
  }

  return (
    <div className="rounded-2xl glass p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span>🎴</span>
        Ngự hồn được khuyên dùng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {souls.map((soul) => (
          <Link
            key={soul.id}
            href={`/wiki/souls/${soul.slug}`}
            className="group relative rounded-xl glass p-4 border border-border hover:border-primary/50 transition-all duration-200 hover:scale-[1.02]"
          >
            {/* Soul Image */}
            {soul.image ? (
              <div className="mb-3 rounded-lg overflow-hidden">
                <img
                  src={soul.image}
                  alt={soul.nameVi || soul.name}
                  className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="mb-3 h-32 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-4xl">🎴</span>
              </div>
            )}

            {/* Type Badge */}
            <div className={`absolute top-6 right-6 px-2 py-1 rounded-full bg-gradient-to-r ${soulTypeColors[soul.type]} text-white font-bold text-xs shadow-lg`}>
              {soulTypeLabels[soul.type]}
            </div>

            {/* Soul Info */}
            <div className="space-y-2">
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {soul.nameVi || soul.name}
              </h3>
              {soul.nameVi && (
                <p className="text-xs text-muted-foreground">{soul.name}</p>
              )}

              {/* 2pc Effect */}
              <div className="p-2 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1">2 món:</p>
                <p className="text-xs text-foreground">
                  {soul.effect2pcVi || soul.effect2pc}
                </p>
              </div>

              {/* 4pc Effect */}
              <div className="p-2 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1">4 món:</p>
                <p className="text-xs text-foreground">
                  {soul.effect4pcVi || soul.effect4pc}
                </p>
              </div>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-primary">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recommendation Note */}
      <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Lưu ý:</strong> Đây là các ngự hồn được khuyên dùng phổ biến. Bạn có thể thử nghiệm các build khác tùy theo đội hình và chiến thuật.
        </p>
      </div>
    </div>
  )
}
