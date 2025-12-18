"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { chatApi, type Message } from "@/lib/api";
import Link from "next/link";

export function ChatFloatingButton() {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await chatApi.getMessages();
      setMessages(data?.messages || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOnlineCount = useCallback(async () => {
    try {
      const data = await chatApi.getOnlineCount();
      setOnlineCount(data?.count || 0);
    } catch (err) {
      console.error("Failed to fetch online count:", err);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchOnlineCount();

    const messageInterval = setInterval(fetchMessages, 10000);
    const onlineInterval = setInterval(fetchOnlineCount, 30000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(onlineInterval);
    };
  }, [fetchMessages, fetchOnlineCount]);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || !token) return;

    setIsSending(true);
    const content = message.trim();
    setMessage("");

    try {
      const data = await chatApi.sendMessage(content, token);
      if (data?.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessage(content);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-primary/5">
            <div className="flex items-center gap-2">
              <span className="text-lg">💬</span>
              <h3 className="font-semibold text-sm">Chat cộng đồng</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs gap-1">
                👥 {onlineCount}
              </Badge>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
                ✕
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-72 p-3" ref={scrollRef}>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (messages?.length || 0) === 0 ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Chưa có tin nhắn nào</div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary-foreground">{(msg.displayName || msg.username || "U").charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-medium text-primary text-xs">{msg.displayName || msg.username}</span>
                        <span className="text-[10px] text-muted-foreground">{formatTime(msg.createdAt)}</span>
                      </div>
                      <p className="text-xs text-foreground break-words">{msg.message || msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-3 border-t border-border bg-muted/30">
            {user ? (
              <form onSubmit={handleSend} className="flex gap-2">
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1 h-8 text-sm bg-background" maxLength={500} />
                <Button type="submit" size="sm" disabled={!message.trim() || isSending} className="h-8 px-3">
                  ➤
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Đăng nhập để tham gia chat</p>
                <Button asChild size="sm" variant="outline" className="h-7 text-xs">
                  <Link href="/login">Đăng nhập</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button onClick={() => setIsOpen(!isOpen)} size="icon" className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 ${isOpen ? "bg-muted hover:bg-muted/80 text-foreground" : "bg-primary hover:bg-primary/90 text-primary-foreground"}`}>
        {isOpen ? (
          <span className="text-xl">💬</span>
        ) : (
          <div className="relative">
            <span className="text-xl">💬</span>
            {onlineCount > 0 && <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{onlineCount > 9 ? "9+" : onlineCount}</span>}
          </div>
        )}
      </Button>
    </div>
  );
}
