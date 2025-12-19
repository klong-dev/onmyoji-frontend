"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { chatApi, AdminMessage, Pagination } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Search, Trash2, Check, Clock, Loader2, RefreshCw, AlertTriangle } from "lucide-react";

interface Stats {
  total: number;
  flagged: number;
  deleted: number;
  today: number;
}

const statusConfig = {
  normal: { label: "Bình thường", variant: "outline" as const, color: "" },
  flagged: { label: "Đánh dấu", variant: "destructive" as const, color: "border-destructive/50 bg-destructive/5" },
  deleted: { label: "Đã xóa", variant: "secondary" as const, color: "border-muted bg-muted/50 opacity-50" },
};

export default function AdminMessages() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "flagged">("all");

  const fetchMessages = useCallback(async (page = 1) => {
    if (!token) return;
    try {
      setIsLoading(true);
      setError(null);
      const [messagesData, statsData] = await Promise.all([
        chatApi.adminGetMessages(token, {
          page,
          search: searchQuery || undefined,
          status: filter === "flagged" ? "flagged" : undefined,
        }),
        chatApi.adminGetStats(token),
      ]);
      setMessages(messagesData.messages);
      setPagination(messagesData.pagination);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  }, [token, searchQuery, filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      await chatApi.adminUpdateMessage(id, "normal", token);
      setMessages(messages.map((msg) => (msg.id === id ? { ...msg, status: "normal" } : msg)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve message");
    }
  };

  const handleFlag = async (id: string) => {
    if (!token) return;
    try {
      await chatApi.adminUpdateMessage(id, "flagged", token);
      setMessages(messages.map((msg) => (msg.id === id ? { ...msg, status: "flagged" } : msg)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to flag message");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await chatApi.adminDeleteMessage(id, token);
      setMessages(messages.map((msg) => (msg.id === id ? { ...msg, status: "deleted" } : msg)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete message");
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Quản lý Tin nhắn</h1>
          <p className="text-muted-foreground">Theo dõi và kiểm duyệt tin nhắn trong hệ thống</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchMessages()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng tin nhắn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{stats.today}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cần xem xét</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.flagged}</div>
            </CardContent>
          </Card>
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Đã xóa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.deleted}</div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  onKeyDown={(e) => e.key === "Enter" && fetchMessages()}
                />
              </div>
              <Button variant={filter === "flagged" ? "default" : "outline"} onClick={() => setFilter(filter === "all" ? "flagged" : "all")}>
                Cần xem xét
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">Không có tin nhắn nào</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 ${statusConfig[message.status]?.color || "border-border bg-background"}`}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{message.displayName?.[0] || message.username?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{message.displayName || message.username}</span>
                        <span className="text-xs text-muted-foreground">@{message.username}</span>
                        {message.user?.role === "admin" && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        <Badge variant={statusConfig[message.status].variant} className="ml-auto">
                          {statusConfig[message.status].label}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-foreground">{message.message}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(message.createdAt)}
                        </span>
                        {message.status !== "deleted" && (
                          <div className="flex gap-2">
                            {message.status === "flagged" && (
                              <Button variant="ghost" size="sm" onClick={() => handleApprove(message.id)} className="h-7 text-xs">
                                <Check className="mr-1 h-3 w-3" />
                                Duyệt
                              </Button>
                            )}
                            {message.status === "normal" && (
                              <Button variant="ghost" size="sm" onClick={() => handleFlag(message.id)} className="h-7 text-xs text-yellow-500 hover:text-yellow-500">
                                <AlertTriangle className="mr-1 h-3 w-3" />
                                Đánh dấu
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(message.id)} className="h-7 text-xs text-destructive hover:text-destructive">
                              <Trash2 className="mr-1 h-3 w-3" />
                              Xóa
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Trang {pagination.page} / {pagination.totalPages} (Tổng: {pagination.total})
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => fetchMessages(pagination.page - 1)}>
                  Trước
                </Button>
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchMessages(pagination.page + 1)}>
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
