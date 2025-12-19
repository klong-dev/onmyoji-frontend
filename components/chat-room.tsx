"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { chatApi, type Message } from "@/lib/api";

export function ChatRoom() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await chatApi.getMessages();
      setMessages(data?.messages || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải tin nhắn");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOnlineCount = useCallback(async () => {
    try {
      const data = await chatApi.getOnlineCount();
      setOnlineCount(data?.total || 0);
    } catch (err) {
      console.error("Failed to fetch online count:", err);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchOnlineCount();

    // Polling for new messages every 5 seconds
    const messageInterval = setInterval(fetchMessages, 5000);
    const onlineInterval = setInterval(fetchOnlineCount, 30000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(onlineInterval);
    };
  }, [fetchMessages, fetchOnlineCount]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !user || !token) return;

    const content = newMessage.trim();
    setNewMessage("");

    try {
      const data = await chatApi.sendMessage(content, token);
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể gửi tin nhắn");
      setNewMessage(content); // Restore message on error
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="mx-auto max-w-4xl border-border bg-card">
      <CardHeader className="border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-serif">
            <span className="text-primary">💬</span>
            Chat Room
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            👥 {onlineCount} online
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Messages */}
        <ScrollArea className="h-[500px] p-4" ref={scrollRef}>
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">Đang tải tin nhắn...</span>
            </div>
          ) : error ? (
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <span className="text-destructive">{error}</span>
              <Button variant="outline" onClick={fetchMessages}>
                Thử lại
              </Button>
            </div>
          ) : (messages?.length || 0) === 0 ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-muted-foreground">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</span>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.userId === user?.id ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/.jpg?height=32&width=32&query=${message.username} avatar`} />
                    <AvatarFallback>{message.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div className={`max-w-[70%] ${message.userId === user?.id ? "text-right" : ""}`}>
                    <div className="flex items-center gap-2">
                      {message.userId !== user?.id && <span className="text-sm font-medium text-foreground">{message.displayName}</span>}
                      <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
                    </div>
                    <div className={`mt-1 inline-block rounded-2xl px-4 py-2 ${message.userId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{message.message || message.content}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          {user ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1" />
              <Button type="submit" disabled={!newMessage.trim()}>
                📤
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">
                Vui lòng{" "}
                <a href="/login" className="text-primary hover:underline">
                  đăng nhập
                </a>{" "}
                để tham gia chat
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
