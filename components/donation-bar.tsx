"use client"

import { useState } from "react"
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

const quickAmounts = [20000, 50000, 100000, 200000, 500000]

const MOCK_DONATION = {
  id: "1",
  title: "Duy trì Server tháng 12",
  description: "Ủng hộ chi phí server và phát triển tính năng mới",
  goalAmount: 5000000,
  currentAmount: 3250000,
}

const MOCK_DONORS = [
  { name: "OnmyojiLover", amount: 500000 },
  { name: "SSRHunter", amount: 200000 },
  { name: "Ẩn danh", amount: 100000 },
  { name: "TamaSama", amount: 150000 },
  { name: "YokaiMaster", amount: 300000 },
]

interface Donation {
  id: string
  title: string
  description: string
  goalAmount: number
  currentAmount: number
}

interface Donor {
  name: string
  amount: number
}

export function DonationBar() {
  const [donation, setDonation] = useState<Donation | null>(MOCK_DONATION)
  const [donors, setDonors] = useState<Donor[]>(MOCK_DONORS)

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(50000)
  const [donorName, setDonorName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!donation) return null

  const percentage = Math.min((donation.currentAmount / donation.goalAmount) * 100, 100)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ"
  }

  const handleDonate = async () => {
    if (amount < 10000) return

    setIsSubmitting(true)
    setTimeout(() => {
      alert(
        `Cảm ơn bạn đã muốn ủng hộ ${formatCurrency(amount)}! Tính năng thanh toán sẽ hoạt động khi kết nối backend.`,
      )
      setIsSubmitting(false)
      setOpen(false)
    }, 1000)
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
