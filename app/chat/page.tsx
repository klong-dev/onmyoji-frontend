import type { Metadata } from "next"
import { ChatRoom } from "@/components/chat-room"

export const metadata: Metadata = {
  title: "Chat - Onmyoji Fan Hub",
  description: "Trò chuyện trực tiếp với cộng đồng Onmyoji Việt Nam. Kết nối, chia sẻ và giao lưu cùng nhau!",
}

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Chat Room</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Trò chuyện trực tiếp với cộng đồng Onmyoji. Hãy cư xử văn minh nhé!
        </p>
      </div>
      <ChatRoom />
    </div>
  )
}
