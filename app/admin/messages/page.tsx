"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Search, Trash2, Check, Clock } from "lucide-react"

interface ChatMessage {
  id: string
  userId: string
  username: string
  displayName: string
  content: string
  createdAt: string
  status: "normal" | "flagged" | "deleted"
}

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    userId: "u1",
    username: "seimei",
    displayName: "Seimei",
    content: "Chào mọi người! Hôm nay ai farm được SSR chưa?",
    createdAt: "2024-01-15T10:30:00",
    status: "normal",
  },
  {
    id: "2",
    userId: "u2",
    username: "kagura",
    displayName: "Kagura",
    content: "Mình vừa kéo được Tamamo no Mae nè!",
    createdAt: "2024-01-15T10:31:00",
    status: "normal",
  },
  {
    id: "3",
    userId: "u3",
    username: "ibaraki",
    displayName: "Ibaraki Doji",
    content: "Spam quảng cáo - nội dung vi phạm",
    createdAt: "2024-01-15T10:32:00",
    status: "flagged",
  },
  {
    id: "4",
    userId: "u4",
    username: "shuten",
    displayName: "Shuten Doji",
    content: "Event mới có vẻ hay đấy, ai tham gia không?",
    createdAt: "2024-01-15T10:35:00",
    status: "normal",
  },
  {
    id: "5",
    userId: "u5",
    username: "tamamo",
    displayName: "Tamamo no Mae",
    content: "Cảm ơn mọi người đã ủng hộ cộng đồng!",
    createdAt: "2024-01-15T10:40:00",
    status: "normal",
  },
]

const statusConfig = {
  normal: { label: "Bình thường", variant: "outline" as const },
  flagged: { label: "Đánh dấu", variant: "destructive" as const },
  deleted: { label: "Đã xóa", variant: "secondary" as const },
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "flagged">("all")

  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || msg.status === "flagged"
    return matchesSearch && matchesFilter
  })

  const handleApprove = (id: string) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, status: "normal" } : msg)))
  }

  const handleDelete = (id: string) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, status: "deleted" } : msg)))
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Tin nhắn</h1>
        <p className="text-muted-foreground">Theo dõi và kiểm duyệt tin nhắn trong hệ thống</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng tin nhắn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{messages.length}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cần xem xét</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {messages.filter((m) => m.status === "flagged").length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đã xóa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {messages.filter((m) => m.status === "deleted").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-serif">
                <MessageSquare className="h-5 w-5 text-primary" />
                Tin nhắn gần đây
              </CardTitle>
              <CardDescription>Kiểm duyệt nội dung chat của người dùng</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant={filter === "flagged" ? "default" : "outline"}
                onClick={() => setFilter(filter === "all" ? "flagged" : "all")}
              >
                Cần xem xét
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-4 rounded-lg border p-4 ${
                    message.status === "flagged"
                      ? "border-destructive/50 bg-destructive/5"
                      : message.status === "deleted"
                        ? "border-muted bg-muted/50 opacity-50"
                        : "border-border bg-background"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={`/.jpg?height=40&width=40&query=${message.username} avatar`}
                    />
                    <AvatarFallback>{message.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{message.displayName}</span>
                      <span className="text-xs text-muted-foreground">@{message.username}</span>
                      <Badge variant={statusConfig[message.status].variant} className="ml-auto">
                        {statusConfig[message.status].label}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{message.content}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTime(message.createdAt)}
                      </span>
                      {message.status !== "deleted" && (
                        <div className="flex gap-2">
                          {message.status === "flagged" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleApprove(message.id)}
                              className="h-7 text-xs"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Duyệt
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(message.id)}
                            className="h-7 text-xs text-destructive hover:text-destructive"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Xóa
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
