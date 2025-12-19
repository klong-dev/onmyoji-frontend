"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Search, MoreHorizontal, Shield, Ban, RefreshCw, CheckCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { authApi, type User } from "@/lib/api"

const roleConfig = {
  admin: { label: "Admin", variant: "default" as const, color: "text-red-500" },
  moderator: { label: "Mod", variant: "secondary" as const, color: "text-blue-500" },
  user: { label: "User", variant: "outline" as const, color: "text-muted-foreground" },
}

export default function AdminUsers() {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<{ total: number; active: number; banned: number; admins: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const [usersData, statsData] = await Promise.all([
        authApi.adminGetUsers(token, { search: searchQuery || undefined }),
        authApi.adminGetStats(token),
      ])
      setUsers(usersData.users || [])
      setStats(statsData)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách người dùng")
    } finally {
      setIsLoading(false)
    }
  }, [token, searchQuery])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleToggleBan = async (user: User) => {
    if (!token) return
    if (!confirm(user.isActive ? "Bạn có chắc muốn cấm người dùng này?" : "Bạn có chắc muốn bỏ cấm người dùng này?")) return
    try {
      await authApi.adminUpdateUser(user.id, { isActive: !user.isActive }, token)
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể cập nhật người dùng")
    }
  }

  const handleChangeRole = async (user: User, newRole: string) => {
    if (!token) return
    try {
      await authApi.adminUpdateUser(user.id, { role: newRole }, token)
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể thay đổi vai trò")
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Chưa đăng nhập"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  if (!token) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Vui lòng đăng nhập để truy cập trang này</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Người dùng</h1>
          <p className="text-muted-foreground">Quản lý tài khoản và quyền hạn người dùng</p>
        </div>
        <Button variant="outline" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">{error}</div>}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng người dùng</CardTitle>
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Bị cấm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats?.banned || 0}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats?.admins || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-serif">
                <Users className="h-5 w-5 text-primary" />
                Danh sách người dùng
              </CardTitle>
              <CardDescription>Quản lý tất cả tài khoản người dùng</CardDescription>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Đang tải...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không tìm thấy người dùng nào</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead>Hoạt động cuối</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{(user.displayName || user.username || "U").charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.displayName || user.username}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleConfig[user.role as keyof typeof roleConfig]?.variant || "outline"}>
                        {roleConfig[user.role as keyof typeof roleConfig]?.label || user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "destructive"}>
                        {user.isActive ? "Hoạt động" : "Bị cấm"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(user.lastLogin)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleChangeRole(user, user.role === "admin" ? "user" : "admin")}>
                            <Shield className="mr-2 h-4 w-4" />
                            {user.role === "admin" ? "Bỏ quyền Admin" : "Gán quyền Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className={user.isActive ? "text-destructive" : "text-green-500"}
                            onClick={() => handleToggleBan(user)}
                          >
                            {user.isActive ? (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Cấm người dùng
                              </>
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Bỏ cấm người dùng
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
