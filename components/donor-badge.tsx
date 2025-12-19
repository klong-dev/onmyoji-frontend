"use client"

interface DonorBadgeProps {
  tier: 'none' | 'bronze' | 'silver' | 'gold' | 'diamond'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function DonorBadge({ tier, size = 'md', showLabel = true }: DonorBadgeProps) {
  if (tier === 'none') return null

  const config = {
    bronze: {
      icon: '🥉',
      label: 'Bronze Donor',
      gradient: 'from-orange-700 to-orange-500',
      glow: 'shadow-orange-500/50',
    },
    silver: {
      icon: '🥈',
      label: 'Silver Donor',
      gradient: 'from-gray-400 to-gray-200',
      glow: 'shadow-gray-400/50',
    },
    gold: {
      icon: '🥇',
      label: 'Gold Donor',
      gradient: 'from-yellow-600 to-yellow-400',
      glow: 'shadow-yellow-500/50',
    },
    diamond: {
      icon: '💎',
      label: 'Diamond Donor',
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/50',
    },
  }

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2',
  }

  const tierConfig = config[tier]

  return (
    <div
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${tierConfig.gradient} ${sizeClasses[size]} ${tierConfig.glow} shadow-lg font-semibold text-white animate-pulse`}
    >
      <span>{tierConfig.icon}</span>
      {showLabel && <span>{tierConfig.label}</span>}
    </div>
  )
}

// Helper component to show tier requirements
export function DonorTierInfo() {
  return (
    <div className="rounded-xl glass p-6 space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <span>👑</span>
        VIP Donor Tiers
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥉</span>
            <div>
              <p className="font-semibold text-foreground">Bronze</p>
              <p className="text-xs text-muted-foreground">Từ 100,000đ</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Badge đặc biệt</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥈</span>
            <div>
              <p className="font-semibold text-foreground">Silver</p>
              <p className="text-xs text-muted-foreground">Từ 500,000đ</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Badge + Avatar frame</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🥇</span>
            <div>
              <p className="font-semibold text-foreground">Gold</p>
              <p className="text-xs text-muted-foreground">Từ 2,000,000đ</p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">Tất cả + Early access</span>
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <p className="font-semibold text-foreground">Diamond</p>
              <p className="text-xs text-muted-foreground">Từ 10,000,000đ</p>
            </div>
          </div>
          <span className="text-xs text-primary font-semibold">VIP Support</span>
        </div>
      </div>
    </div>
  )
}
