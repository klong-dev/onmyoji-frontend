"use client"

import type { ShikigamiData } from "@/lib/api"

interface ShikigamiStatsChartProps {
  shikigami: ShikigamiData
}

export function ShikigamiStatsChart({ shikigami }: ShikigamiStatsChartProps) {
  const stats = [
    { label: "HP", value: shikigami.baseHp || 0, max: 15000, color: "bg-red-500" },
    { label: "ATK", value: shikigami.baseAtk || 0, max: 3500, color: "bg-orange-500" },
    { label: "DEF", value: shikigami.baseDef || 0, max: 500, color: "bg-blue-500" },
    { label: "SPD", value: shikigami.baseSpd || 0, max: 130, color: "bg-green-500" },
    { label: "CRIT", value: shikigami.baseCritRate || 0, max: 100, color: "bg-yellow-500" },
    { label: "CRIT DMG", value: shikigami.baseCritDmg || 0, max: 200, color: "bg-purple-500" },
  ]

  return (
    <div className="rounded-2xl glass p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <span>📊</span>
        Chỉ số cơ bản
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{stat.label}</span>
              <span className="text-primary font-bold">
                {stat.value}
                {stat.label.includes("CRIT") && !stat.label.includes("DMG") && "%"}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 ${stat.color} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min((stat.value / stat.max) * 100, 100)}%` }}
              />
            </div>

            {/* Max Value */}
            <p className="text-xs text-muted-foreground text-right">
              Max: {stat.max}
            </p>
          </div>
        ))}
      </div>

      {/* Comparison Note */}
      <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Lưu ý:</strong> Đây là chỉ số cơ bản ở cấp độ 1. Chỉ số thực tế sẽ cao hơn khi lên cấp và trang bị ngự hồn.
        </p>
      </div>
    </div>
  )
}
