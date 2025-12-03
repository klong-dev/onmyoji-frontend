"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Gift, Plus, Copy, Trash2, Edit, Search } from "lucide-react"

interface Giftcode {
  id: string
  code: string
  description: string
  status: "active" | "expired" | "used"
  usageCount: number
  maxUsage: number
  expiresAt: string
  createdAt: string
}

const mockGiftcodes: Giftcode[] = [
  {
    id: "1",
    code: "ONMYOJI2024",
    description: "Mừng năm mới 2024",
    status: "active",
    usageCount: 150,
    maxUsage: 500,
    expiresAt: "2024-12-31",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    code: "SEIMEI100",
    description: "Kỷ niệm 100 ngày",
    status: "active",
    usageCount: 89,
    maxUsage: 100,
    expiresAt: "2024-06-30",
    createdAt: "2024-03-15",
  },
  {
    id: "3",
    code: "SSR2023",
    description: "Event SSR cuối năm",
    status: "expired",
    usageCount: 1000,
    maxUsage: 1000,
    expiresAt: "2023-12-31",
    createdAt: "2023-12-01",
  },
]

const statusConfig = {
  active: { label: "Hoạt động", variant: "default" as const },
  expired: { label: "Hết hạn", variant: "secondary" as const },
  used: { label: "Đã dùng hết", variant: "outline" as const },
}

export default function AdminGiftcodes() {
  const [giftcodes, setGiftcodes] = useState<Giftcode[]>(mockGiftcodes)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCode, setNewCode] = useState({
    code: "",
    description: "",
    maxUsage: "",
    expiresAt: "",
  })

  const filteredGiftcodes = giftcodes.filter(
    (gc) =>
      gc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gc.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreate = () => {
    const giftcode: Giftcode = {
      id: Date.now().toString(),
      code: newCode.code.toUpperCase(),
      description: newCode.description,
      status: "active",
      usageCount: 0,
      maxUsage: Number.parseInt(newCode.maxUsage) || 100,
      expiresAt: newCode.expiresAt,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setGiftcodes([giftcode, ...giftcodes])
    setNewCode({ code: "", description: "", maxUsage: "", expiresAt: "" })
    setIsCreateOpen(false)
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const handleDelete = (id: string) => {
    setGiftcodes(giftcodes.filter((gc) => gc.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Giftcode</h1>
          <p className="text-muted-foreground">Tạo và quản lý các mã giftcode cho cộng đồng</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo Giftcode
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif">Tạo Giftcode mới</DialogTitle>
              <DialogDescription>Điền thông tin để tạo mã giftcode mới cho cộng đồng</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã code</Label>
                <Input
                  id="code"
                  placeholder="VD: ONMYOJI2024"
                  value={newCode.code}
                  onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  placeholder="Mô tả giftcode..."
                  value={newCode.description}
                  onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxUsage">Giới hạn sử dụng</Label>
                  <Input
                    id="maxUsage"
                    type="number"
                    placeholder="100"
                    value={newCode.maxUsage}
                    onChange={(e) => setNewCode({ ...newCode, maxUsage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Ngày hết hạn</Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={newCode.expiresAt}
                    onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreate} disabled={!newCode.code}>
                Tạo Giftcode
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Giftcode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{giftcodes.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {giftcodes.filter((gc) => gc.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng lượt sử dụng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {giftcodes.reduce((sum, gc) => sum + gc.usageCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Gift className="h-5 w-5 text-primary" />
                Danh sách Giftcode
              </CardTitle>
              <CardDescription>Quản lý tất cả các mã giftcode</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã Code</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Sử dụng</TableHead>
                <TableHead>Hết hạn</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGiftcodes.map((giftcode) => (
                <TableRow key={giftcode.id}>
                  <TableCell className="font-mono font-medium">{giftcode.code}</TableCell>
                  <TableCell className="text-muted-foreground">{giftcode.description}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[giftcode.status].variant}>{statusConfig[giftcode.status].label}</Badge>
                  </TableCell>
                  <TableCell>
                    {giftcode.usageCount}/{giftcode.maxUsage}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{giftcode.expiresAt}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(giftcode.code)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(giftcode.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
