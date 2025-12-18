"use client";

import type React from "react";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { chatApi, type Message } from "@/lib/api";

export function ChatBox() {
  const { user, token } = useAuth();
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

    // Polling for new messages every 10 seconds
    const messageInterval = setInterval(fetchMessages, 10000);
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || !token) return;

    setIsSending(true);
    const content = message.trim();
    setMessage("");

    try {
      const data = await chatApi.sendMessage(content, token);
      setMessages((prev) => [...prev, data.message]);
    } catch (err) {
      console.error("Failed to send message:", err);
      setMessage(content); // Restore message on error
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
    <div className="rounded-2xl glass overflow-hidden h-[400px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <h3 className="font-semibold">Chat cộng đồng</h3>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>👥</span>
          <span>{onlineCount} online</span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (messages?.length || 0) === 0 ? (
          <div className="text-center text-muted-foreground py-8">Chưa có tin nhắn nào. Hãy là người đầu tiên!</div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary-foreground">{(msg.displayName || msg.username || "U").charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-primary text-sm">{msg.displayName || msg.username}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="text-sm text-foreground break-words">{msg.message || msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        {user ? (
          <form onSubmit={handleSend} className="flex gap-2">
            <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Nhập tin nhắn..." className="flex-1 bg-muted border-border" maxLength={500} />
            <Button type="submit" size="icon" disabled={!message.trim() || isSending} className="bg-primary hover:bg-primary/90 shrink-0">
              <span>➤</span>
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Đăng nhập để tham gia chat</p>
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Đăng nhập</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
