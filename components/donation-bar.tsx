"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { donationApi, type Donation, type Donor } from "@/lib/api"

const quickAmounts = [20000, 50000, 100000, 200000, 500000]

export function DonationBar() {
  const [donation, setDonation] = useState<Donation | null>(null)
  const [donors, setDonors] = useState<Donor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(50000)
  const [donorName, setDonorName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchDonation = useCallback(async () => {
    try {
      setError(null)
      const data = await donationApi.getActive()
      // API trả về data trực tiếp (đã unwrap từ { success, data })
      setDonation(data as unknown as Donation)
    } catch (err) {
      console.error("Failed to fetch donation:", err)
      setError("Không thể tải thông tin donation")
    }
  }, [])

  const fetchDonors = useCallback(async () => {
    try {
      const data = await donationApi.getRecentDonors()
      // API trả về mảng DonorTransaction từ backend
      const donorsArray = Array.isArray(data) ? data : []
      // Map backend field names to frontend Donor interface
      const mappedDonors: Donor[] = donorsArray.map((d) => ({
        name: d.donorName || "Ẩn danh",
        amount: d.amount,
        message: d.donorMessage || undefined,
        createdAt: d.paidAt,
      }))
      setDonors(mappedDonors)
    } catch (err) {
      console.error("Failed to fetch donors:", err)
    }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([fetchDonation(), fetchDonors()])
      setIsLoading(false)
    }
    loadData()
  }, [fetchDonation, fetchDonors])

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 rounded-2xl glass">
        <div className="flex items-center justify-center py-4">
          <span className="animate-spin mr-2">⏳</span>
          <span className="text-muted-foreground">Đang tải...</span>
        </div>
      </div>
    )
  }

  // No active donation or error
  if (!donation || error) return null

  const percentage = Math.min((donation.currentAmount / donation.goalAmount) * 100, 100)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ"
  }

  const handleDonate = async () => {
    if (amount < 10000) return

    setIsSubmitting(true)
    try {
      const response = await donationApi.createPayment({
        amount,
        donorName: donorName.trim() || undefined,
        donorMessage: message.trim() || undefined,
      })

      // Redirect to PayOS checkout
      if (response.checkoutUrl) {
        window.location.href = response.checkoutUrl
      } else {
        throw new Error("Không nhận được link thanh toán")
      }
    } catch (err) {
      console.error("Payment error:", err)
      alert(err instanceof Error ? err.message : "Không thể tạo thanh toán. Vui lòng thử lại.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-2xl glass">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <span className="text-xl animate-pulse">❤️</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{donation.title}</h3>
            <p className="text-sm text-muted-foreground">{donation.description}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Donate ngay
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ủng hộ dự án</DialogTitle>
              <DialogDescription>Mọi đóng góp đều giúp duy trì và phát triển tool</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Mini progress */}
              <div className="p-3 rounded-lg bg-muted">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Tiến độ</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(donation.currentAmount)} / {formatCurrency(donation.goalAmount)}
                  </span>
                </div>
                <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Quick amounts */}
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Số tiền</Label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {quickAmounts.map((amt) => (
                    <Button
                      key={amt}
                      variant={amount === amt ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAmount(amt)}
                      className={amount === amt ? "bg-primary hover:bg-primary/90" : ""}
                    >
                      {formatCurrency(amt)}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Nhập số tiền khác"
                  min={10000}
                  step={1000}
                />
              </div>

              {/* Donor info */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="donorName">Tên của bạn (tùy chọn)</Label>
                  <Input
                    id="donorName"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Ẩn danh"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Lời nhắn (tùy chọn)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gửi lời nhắn đến team..."
                    rows={2}
                  />
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleDonate}
                disabled={isSubmitting || amount < 10000}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Đang xử lý...
                  </>
                ) : (
                  <>Donate {formatCurrency(amount)}</>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Thanh toán qua PayOS - Hỗ trợ mọi ngân hàng VN
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
        <div className="absolute inset-0 animate-shimmer" />
      </div>

      {/* Stats */}
      <div className="flex justify-between text-sm mb-4">
        <span className="text-muted-foreground">
          <span className="text-foreground font-medium">{formatCurrency(donation.currentAmount)}</span>
          {" / "}
          {formatCurrency(donation.goalAmount)}
        </span>
        <span className="text-primary font-medium">{percentage.toFixed(0)}%</span>
      </div>

      {/* Recent donors */}
      {donors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {donors.slice(0, 5).map((donor, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary"
            >
              {donor.name} - {formatCurrency(donor.amount)}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
