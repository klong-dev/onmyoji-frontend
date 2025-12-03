"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/auth-context"

interface Message {
  id: string
  userId: string
  username: string
  displayName: string
  content: string
  createdAt: string
}

const mockMessages: Message[] = [
  {
    id: "1",
    userId: "u1",
    username: "seimei",
    displayName: "Seimei",
    content: "Chào mọi người! Hôm nay ai farm được SSR chưa?",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    userId: "u2",
    username: "kagura",
    displayName: "Kagura",
    content: "Mình vừa kéo được Tamamo no Mae nè! Vui quá!",
    createdAt: new Date(Date.now() - 3000000).toISOString(),
  },
  {
    id: "3",
    userId: "u3",
    username: "ibaraki",
    displayName: "Ibaraki Doji",
    content: "Chúc mừng bạn! Tamamo mạnh lắm đó",
    createdAt: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: "4",
    userId: "u4",
    username: "shuten",
    displayName: "Shuten Doji",
    content: "Event mới có vẻ hay đấy, ai tham gia chưa?",
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
]

export function ChatRoom() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [onlineCount] = useState(23)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim() || !user) return

    const message: Message = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      content: newMessage,
      createdAt: new Date().toISOString(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.userId === user?.id ? "flex-row-reverse" : ""}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`/.jpg?height=32&width=32&query=${message.username} avatar`} />
                  <AvatarFallback>{message.displayName[0]}</AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] ${message.userId === user?.id ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2">
                    {message.userId !== user?.id && (
                      <span className="text-sm font-medium text-foreground">{message.displayName}</span>
                    )}
                    <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
                  </div>
                  <div
                    className={`mt-1 inline-block rounded-2xl px-4 py-2 ${
                      message.userId === user?.id ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4">
          {user ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-2"
            >
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1"
              />
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
  )
}
