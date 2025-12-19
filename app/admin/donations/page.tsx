"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Crown, Target, Edit2, Save, X, Plus, RefreshCw, Trash2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { donationApi, type Donation } from "@/lib/api"

export default function AdminDonations() {
  const { token } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [activeDonation, setActiveDonation] = useState<Donation | null>(null)
  const [recentDonors, setRecentDonors] = useState<{ donorName: string; amount: number; donorMessage?: string; paidAt: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    goalAmount: 0,
    isActive: true,
  })

  const [newDonation, setNewDonation] = useState({
    title: "",
    description: "",
    goalAmount: "",
    setActive: true,
  })

  const fetchDonations = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const data = await donationApi.adminList(token)
      setDonations(data.donations || [])

      // Find active donation
      const active = (data.donations || []).find((d: Donation) => d.isActive)
      setActiveDonation(active || null)

      if (active) {
        setEditForm({
          title: active.title,
          description: active.description || "",
          goalAmount: active.goalAmount,
          isActive: active.isActive,
        })
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách donations")
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const fetchRecentDonors = useCallback(async () => {
    try {
      const data = await donationApi.getRecentDonors()
      const donors = Array.isArray(data) ? data : []
      setRecentDonors(donors)
    } catch (err) {
      console.error("Failed to fetch donors:", err)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
    fetchRecentDonors()
  }, [fetchDonations, fetchRecentDonors])

  const handleSave = async () => {
    if (!token || !activeDonation) return
    setIsSubmitting(true)
    try {
      await donationApi.adminUpdate(
        activeDonation.id,
        {
          title: editForm.title,
          description: editForm.description,
          goalAmount: editForm.goalAmount,
          isActive: editForm.isActive,
        },
        token
      )
      setIsEditing(false)
      fetchDonations()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật donation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (activeDonation) {
      setEditForm({
        title: activeDonation.title,
        description: activeDonation.description || "",
        goalAmount: activeDonation.goalAmount,
        isActive: activeDonation.isActive,
      })
    }
    setIsEditing(false)
  }

  const handleCreate = async () => {
    if (!token || !newDonation.title || !newDonation.goalAmount) return
    setIsSubmitting(true)
    try {
      await donationApi.adminCreate(
        {
          title: newDonation.title,
          description: newDonation.description,
          goalAmount: parseInt(newDonation.goalAmount),
          isActive: newDonation.setActive,
        },
        token
      )
      setNewDonation({ title: "", description: "", goalAmount: "", setActive: true })
      setIsCreateOpen(false)
      fetchDonations()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo donation")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm("Bạn có chắc muốn xóa chiến dịch này?")) return
    try {
      await donationApi.adminDelete(id, token)
      fetchDonations()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa donation")
    }
  }

  const handleSetActive = async (donation: Donation) => {
    if (!token) return
    try {
      await donationApi.adminUpdate(donation.id, { isActive: true }, token)
      fetchDonations()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể kích hoạt donation")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Vui lòng đăng nhập để truy cập trang này</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Đang tải...</span>
      </div>
    )
  }

  const progress = activeDonation ? (activeDonation.currentAmount / activeDonation.goalAmount) * 100 : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Quyên góp</h1>
          <p className="text-muted-foreground">Cấu hình và theo dõi tiến trình quyên góp</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchDonations} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tạo mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-serif">Tạo chiến dịch quyên góp mới</DialogTitle>
                <DialogDescription>Điền thông tin để tạo chiến dịch mới</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="newTitle">Tiêu đề chiến dịch</Label>
                  <Input
                    id="newTitle"
                    value={newDonation.title}
                    onChange={(e) => setNewDonation({ ...newDonation, title: e.target.value })}
                    placeholder="VD: Duy trì Server tháng 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newDescription">Mô tả</Label>
                  <Textarea
                    id="newDescription"
                    value={newDonation.description}
                    onChange={(e) => setNewDonation({ ...newDonation, description: e.target.value })}
                    placeholder="Mô tả mục đích quyên góp..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newGoalAmount">Mục tiêu (VND)</Label>
                  <Input
                    id="newGoalAmount"
                    type="number"
                    value={newDonation.goalAmount}
                    onChange={(e) => setNewDonation({ ...newDonation, goalAmount: e.target.value })}
                    placeholder="5000000"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="setActive"
                    checked={newDonation.setActive}
                    onChange={(e) => setNewDonation({ ...newDonation, setActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="setActive">Kích hoạt ngay (sẽ tắt chiến dịch cũ)</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreate} disabled={!newDonation.title || !newDonation.goalAmount || isSubmitting}>
                  {isSubmitting ? "Đang tạo..." : "Tạo chiến dịch"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{error}</div>}

      {/* Current Active Progress */}
      {activeDonation ? (
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-serif">
                <Target className="h-5 w-5 text-primary" />
                Chiến dịch đang hoạt động
              </CardTitle>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="gap-2" variant="outline">
                  <Edit2 className="h-4 w-4" />
                  Chỉnh sửa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>
                  <Button onClick={handleSave} className="gap-2" disabled={isSubmitting}>
                    <Save className="h-4 w-4" />
                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                  </Button>
                </div>
              )}
            </div>
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
                <div className="space-y-2">
                  <Label htmlFor="goalAmount">Mục tiêu (VND)</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    value={editForm.goalAmount}
                    onChange={(e) => setEditForm({ ...editForm, goalAmount: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{activeDonation.title}</h3>
                  <p className="mt-2 text-muted-foreground">{activeDonation.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tiến độ</span>
                    <span className="font-medium text-foreground">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(progress, 100)} className="h-4" />
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-primary">{formatCurrency(activeDonation.currentAmount)}</span>
                    <span className="text-muted-foreground">/ {formatCurrency(activeDonation.goalAmount)}</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-card">
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground">Chưa có chiến dịch quyên góp nào đang hoạt động</p>
            <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
              Tạo chiến dịch mới
            </Button>
          </CardContent>
        </Card>
      )}

      {/* All Campaigns */}
      {donations.length > 0 && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="font-serif">Tất cả chiến dịch</CardTitle>
            <CardDescription>Danh sách tất cả các chiến dịch quyên góp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{donation.title}</p>
                      {donation.isActive && <Badge variant="default">Đang hoạt động</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatCurrency(donation.currentAmount)} / {formatCurrency(donation.goalAmount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!donation.isActive && (
                      <Button variant="outline" size="sm" onClick={() => handleSetActive(donation)}>
                        Kích hoạt
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(donation.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
          {recentDonors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Chưa có khoản quyên góp nào</div>
          ) : (
            <div className="space-y-4">
              {recentDonors.map((donor, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Crown className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{donor.donorName}</p>
                      {donor.donorMessage && <p className="text-sm text-muted-foreground">&ldquo;{donor.donorMessage}&rdquo;</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{formatCurrency(donor.amount)}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(donor.paidAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
