"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Crown, Target, Edit2, Save, X } from "lucide-react"

export default function AdminDonations() {
  const [isEditing, setIsEditing] = useState(false)
  const [donationConfig, setDonationConfig] = useState({
    currentAmount: 15000000,
    targetAmount: 50000000,
    title: "Quỹ phát triển cộng đồng Onmyoji",
    description:
      "Hỗ trợ duy trì và phát triển các hoạt động cộng đồng, tổ chức sự kiện và tạo nội dung chất lượng cho người chơi.",
  })

  const [editForm, setEditForm] = useState(donationConfig)

  const progress = (donationConfig.currentAmount / donationConfig.targetAmount) * 100

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleSave = () => {
    setDonationConfig(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(donationConfig)
    setIsEditing(false)
  }

  const recentDonations = [
    { name: "Seimei", amount: 500000, date: "2024-01-15", message: "Ủng hộ cộng đồng!" },
    { name: "Kagura", amount: 200000, date: "2024-01-14", message: "Chúc dự án phát triển" },
    { name: "Ibaraki Doji", amount: 1000000, date: "2024-01-13", message: "SSR luck cho mọi người" },
    { name: "Shuten Doji", amount: 300000, date: "2024-01-12", message: "" },
    { name: "Tamamo no Mae", amount: 150000, date: "2024-01-11", message: "Yêu Onmyoji" },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Quyên góp</h1>
          <p className="text-muted-foreground">Cấu hình và theo dõi tiến trình quyên góp</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
              <X className="h-4 w-4" />
              Hủy
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Lưu
            </Button>
          </div>
        )}
      </div>

      {/* Current Progress */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Target className="h-5 w-5 text-primary" />
            Tiến trình hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề chiến dịch</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentAmount">Số tiền hiện tại (VND)</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    value={editForm.currentAmount}
                    onChange={(e) => setEditForm({ ...editForm, currentAmount: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAmount">Mục tiêu (VND)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={editForm.targetAmount}
                    onChange={(e) => setEditForm({ ...editForm, targetAmount: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{donationConfig.title}</h3>
                <p className="mt-2 text-muted-foreground">{donationConfig.description}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tiến độ</span>
                  <span className="font-medium text-foreground">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} className="h-4" />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-primary">{formatCurrency(donationConfig.currentAmount)}</span>
                  <span className="text-muted-foreground">/ {formatCurrency(donationConfig.targetAmount)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Donations */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif">
            <Crown className="h-5 w-5 text-primary" />
            Quyên góp gần đây
          </CardTitle>
          <CardDescription>Danh sách các khoản quyên góp mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDonations.map((donation, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{donation.name}</p>
                    {donation.message && <p className="text-sm text-muted-foreground">"{donation.message}"</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{formatCurrency(donation.amount)}</p>
                  <p className="text-xs text-muted-foreground">{donation.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
