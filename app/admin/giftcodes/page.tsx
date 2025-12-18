"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Gift, Plus, Copy, Trash2, Search, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { giftcodeApi, type Giftcode, type GiftcodeStats } from "@/lib/api";

const statusConfig = {
  active: { label: "Hoạt động", variant: "default" as const },
  expired: { label: "Hết hạn", variant: "secondary" as const },
  used: { label: "Đã dùng hết", variant: "outline" as const },
};

export default function AdminGiftcodes() {
  const { token } = useAuth();
  const [giftcodes, setGiftcodes] = useState<Giftcode[]>([]);
  const [stats, setStats] = useState<GiftcodeStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCode, setNewCode] = useState({
    code: "",
    description: "",
    rewards: "",
    maxUsage: "",
    expiresAt: "",
  });

  const fetchGiftcodes = useCallback(async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const [listData, statsData] = await Promise.all([giftcodeApi.adminList(token, { search: searchQuery || undefined }), giftcodeApi.adminStats(token)]);
      setGiftcodes(listData.giftcodes);
      setStats(statsData.stats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách");
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery]);

  useEffect(() => {
    fetchGiftcodes();
  }, [fetchGiftcodes]);

  const handleCreate = async () => {
    if (!token || !newCode.code) return;
    try {
      setIsSubmitting(true);
      await giftcodeApi.adminCreate(
        {
          code: newCode.code.toUpperCase(),
          description: newCode.description || undefined,
          rewards: newCode.rewards ? newCode.rewards.split(",").map((r) => r.trim()) : [],
          maxUsage: newCode.maxUsage ? parseInt(newCode.maxUsage) : null,
          expiresAt: newCode.expiresAt || null,
        },
        token
      );
      setNewCode({ code: "", description: "", rewards: "", maxUsage: "", expiresAt: "" });
      setIsCreateOpen(false);
      fetchGiftcodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo giftcode");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Bạn có chắc muốn xóa giftcode này?")) return;
    try {
      await giftcodeApi.adminDelete(id, token);
      fetchGiftcodes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể xóa giftcode");
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Không giới hạn";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Vui lòng đăng nhập để truy cập trang này</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Giftcode</h1>
          <p className="text-muted-foreground">Tạo và quản lý các mã giftcode cho cộng đồng</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchGiftcodes} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
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
                  <Input id="code" placeholder="VD: ONMYOJI2024" value={newCode.code} onChange={(e) => setNewCode({ ...newCode, code: e.target.value })} className="uppercase" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" placeholder="Mô tả giftcode..." value={newCode.description} onChange={(e) => setNewCode({ ...newCode, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rewards">Phần thưởng (cách nhau bởi dấu phẩy)</Label>
                  <Input id="rewards" placeholder="500 Jade, 10x Amulet, 1x SSR" value={newCode.rewards} onChange={(e) => setNewCode({ ...newCode, rewards: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUsage">Giới hạn sử dụng</Label>
                    <Input id="maxUsage" type="number" placeholder="Không giới hạn" value={newCode.maxUsage} onChange={(e) => setNewCode({ ...newCode, maxUsage: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Ngày hết hạn</Label>
                    <Input id="expiresAt" type="date" value={newCode.expiresAt} onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreate} disabled={!newCode.code || isSubmitting}>
                  {isSubmitting ? "Đang tạo..." : "Tạo Giftcode"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{error}</div>}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng Giftcode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats?.active || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hết hạn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats?.expired || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã dùng hết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats?.used || 0}</div>
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
              <Input placeholder="Tìm kiếm..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-muted-foreground">Đang tải...</span>
            </div>
          ) : giftcodes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-muted-foreground">Chưa có giftcode nào</span>
            </div>
          ) : (
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
                {giftcodes.map((giftcode) => (
                  <TableRow key={giftcode.id}>
                    <TableCell className="font-mono font-medium">{giftcode.code}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">{giftcode.description}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[giftcode.status].variant}>{statusConfig[giftcode.status].label}</Badge>
                    </TableCell>
                    <TableCell>
                      {giftcode.usageCount || 0}/{giftcode.maxUsage || "∞"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(giftcode.expiresAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(giftcode.code)}>
                          <Copy className="h-4 w-4" />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
