"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Users, Search, MoreHorizontal, Shield, Ban, Mail } from "lucide-react"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "moderator" | "user"
  status: "active" | "banned" | "pending"
  joinedAt: string
  lastActive: string
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "Seimei",
    email: "seimei@onmyoji.com",
    role: "admin",
    status: "active",
    joinedAt: "2023-01-15",
    lastActive: "2024-01-15",
  },
  {
    id: "2",
    username: "Kagura",
    email: "kagura@onmyoji.com",
    role: "moderator",
    status: "active",
    joinedAt: "2023-03-20",
    lastActive: "2024-01-14",
  },
  {
    id: "3",
    username: "Ibaraki",
    email: "ibaraki@onmyoji.com",
    role: "user",
    status: "active",
    joinedAt: "2023-06-10",
    lastActive: "2024-01-13",
  },
  {
    id: "4",
    username: "Shuten",
    email: "shuten@onmyoji.com",
    role: "user",
    status: "banned",
    joinedAt: "2023-08-05",
    lastActive: "2023-12-01",
  },
  {
    id: "5",
    username: "Tamamo",
    email: "tamamo@onmyoji.com",
    role: "user",
    status: "pending",
    joinedAt: "2024-01-10",
    lastActive: "2024-01-10",
  },
]

const roleConfig = {
  admin: { label: "Admin", variant: "default" as const, color: "text-red-500" },
  moderator: { label: "Mod", variant: "secondary" as const, color: "text-blue-500" },
  user: { label: "User", variant: "outline" as const, color: "text-muted-foreground" },
}

const statusConfig = {
  active: { label: "Hoạt động", variant: "default" as const },
  banned: { label: "Bị cấm", variant: "destructive" as const },
  pending: { label: "Chờ duyệt", variant: "secondary" as const },
}

export default function AdminUsers() {
  const [users] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Người dùng</h1>
        <p className="text-muted-foreground">Quản lý tài khoản và quyền hạn người dùng</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{users.filter((u) => u.status === "active").length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Chờ duyệt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {users.filter((u) => u.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bị cấm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{users.filter((u) => u.status === "banned").length}</div>
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/.jpg?height=32&width=32&query=${user.username} avatar`}
                        />
                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleConfig[user.role].variant}>{roleConfig[user.role].label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[user.status].variant}>{statusConfig[user.status].label}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.joinedAt}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
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
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Gửi email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Thay đổi quyền
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Ban className="mr-2 h-4 w-4" />
                          Cấm người dùng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
