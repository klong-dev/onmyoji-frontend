"use client"

import { useState, useEffect } from "react"
import { donationApi, type Milestone } from "@/lib/api"

export function DonationMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [currentAmount, setCurrentAmount] = useState(0)
  const [goalAmount, setGoalAmount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const data = await donationApi.getMilestones()
        setMilestones(data.milestones || [])
        setCurrentAmount(data.currentAmount || 0)
        setGoalAmount(data.goalAmount || 0)
      } catch (error) {
        console.error("Failed to fetch milestones:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMilestones()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ"
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl glass p-6">
        <div className="flex items-center justify-center py-4">
          <span className="animate-spin mr-2">⏳</span>
          <span className="text-muted-foreground">Đang tải...</span>
        </div>
      </div>
    )
  }

  if (milestones.length === 0) return null

  return (
    <div className="rounded-2xl glass p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">🎯</span>
        <div>
          <h3 className="text-xl font-bold text-foreground">Các Mốc Donation</h3>
          <p className="text-sm text-muted-foreground">
            Hiện tại: {formatCurrency(currentAmount)} / {formatCurrency(goalAmount)}
          </p>
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`relative p-4 rounded-xl border transition-all duration-300 ${
              milestone.reached
                ? 'border-primary bg-primary/5'
                : 'border-border bg-muted/30'
            }`}
          >
            {/* Milestone Info */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  milestone.reached
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {milestone.reached ? '✓' : index + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{milestone.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Mục tiêu: {formatCurrency(milestone.amount)}
                  </p>
                </div>
              </div>
              
              {milestone.reached && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                  Đạt được! 🎉
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  milestone.reached
                    ? 'bg-gradient-to-r from-primary to-primary/70'
                    : 'bg-gradient-to-r from-primary/50 to-primary/30'
                }`}
                style={{ width: `${milestone.progress}%` }}
              />
            </div>

            {/* Progress Percentage */}
            {!milestone.reached && (
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {milestone.progress.toFixed(1)}%
              </p>
            )}
          </div>
        ))}
      </div>

      {/* All Milestones Reached */}
      {milestones.every(m => m.reached) && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 text-center">
          <p className="text-lg font-bold text-foreground">🎊 Đã hoàn thành tất cả mốc! 🎊</p>
          <p className="text-sm text-muted-foreground mt-1">
            Cảm ơn sự ủng hộ nhiệt tình của cộng đồng!
          </p>
        </div>
      )}
    </div>
  )
}
