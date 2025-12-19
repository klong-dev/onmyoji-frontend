"use client"

import { useState, useEffect } from "react"
import { donationApi, type LeaderboardEntry } from "@/lib/api"
import { Button } from "@/components/ui/button"

export function DonationLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true)
      try {
        const data = await donationApi.getLeaderboard(period, 10)
        setLeaderboard(data.leaderboard || [])
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [period])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ"
  }

  const getProgressWidth = (amount: number) => {
    if (leaderboard.length === 0) return 0
    const maxAmount = leaderboard[0]?.totalAmount || 1
    return Math.min((amount / maxAmount) * 100, 100)
  }

  return (
    <div className="rounded-2xl glass p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <h3 className="text-xl font-bold text-foreground">Bảng Xếp Hạng Donors</h3>
        </div>
        
        {/* Period Filter */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={period === 'all' ? 'default' : 'outline'}
            onClick={() => setPeriod('all')}
            className={period === 'all' ? 'bg-primary' : ''}
          >
            Tất cả
          </Button>
          <Button
            size="sm"
            variant={period === 'month' ? 'default' : 'outline'}
            onClick={() => setPeriod('month')}
            className={period === 'month' ? 'bg-primary' : ''}
          >
            Tháng
          </Button>
          <Button
            size="sm"
            variant={period === 'week' ? 'default' : 'outline'}
            onClick={() => setPeriod('week')}
            className={period === 'week' ? 'bg-primary' : ''}
          >
            Tuần
          </Button>
        </div>
      </div>

      {/* Leaderboard List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <span className="animate-spin mr-2">⏳</span>
          <span className="text-muted-foreground">Đang tải...</span>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Chưa có donors nào trong kỳ này
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`relative p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                entry.rank <= 3
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border bg-muted/30'
              }`}
            >
              {/* Background Progress Bar */}
              <div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent transition-all duration-500"
                style={{ width: `${getProgressWidth(entry.totalAmount)}%` }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    entry.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                    entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                    entry.rank === 3 ? 'bg-orange-500/20 text-orange-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {entry.badge || entry.rank}
                  </div>

                  {/* Donor Info */}
                  <div>
                    <p className="font-semibold text-foreground">{entry.donorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.donationCount} lần donate
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">
                    {formatCurrency(entry.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
