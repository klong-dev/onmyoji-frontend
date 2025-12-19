"use client"

import type { ShikigamiSkillData } from "@/lib/api"

interface SkillCardProps {
  skill: ShikigamiSkillData
}

export function SkillCard({ skill }: SkillCardProps) {
  const skillTypeColors = {
    normal: "from-gray-600 to-gray-500",
    passive: "from-blue-600 to-cyan-600",
    active: "from-purple-600 to-pink-600",
  }

  const skillTypeLabels = {
    normal: "Thường",
    passive: "Bị động",
    active: "Chủ động",
  }

  return (
    <div className="rounded-xl glass p-6 border border-border hover:border-primary/50 transition-all duration-200">
      <div className="flex items-start gap-4">
        {/* Skill Icon */}
        {skill.icon ? (
          <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 border-border">
            <img src={skill.icon} alt={skill.nameVi || skill.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl">
            ⚔️
          </div>
        )}

        {/* Skill Info */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {skill.nameVi || skill.name}
              </h3>
              {skill.nameVi && (
                <p className="text-sm text-muted-foreground">{skill.name}</p>
              )}
            </div>

            {/* Type Badge */}
            <span className={`inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r ${skillTypeColors[skill.type]} text-white font-semibold text-xs whitespace-nowrap`}>
              {skillTypeLabels[skill.type]}
            </span>
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {skill.descriptionVi || skill.description}
          </p>

          {/* Skill Details */}
          <div className="flex flex-wrap gap-3 text-sm">
            {skill.cooldown !== undefined && skill.cooldown > 0 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
                <span>⏱️</span>
                <span className="text-foreground font-medium">CD: {skill.cooldown} turn</span>
              </div>
            )}
            
            {skill.orbs !== undefined && skill.orbs > 0 && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
                <span>🔮</span>
                <span className="text-foreground font-medium">{skill.orbs} orbs</span>
              </div>
            )}

            {skill.damage && (
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted">
                <span>💥</span>
                <span className="text-foreground font-medium">{skill.damage}</span>
              </div>
            )}
          </div>

          {/* Effects */}
          {skill.effects && Object.keys(skill.effects).length > 0 && (
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Hiệu ứng:</p>
              <div className="space-y-1">
                {Object.entries(skill.effects).map(([key, value]) => (
                  <p key={key} className="text-sm text-foreground">
                    • <span className="font-medium">{key}:</span> {String(value)}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
