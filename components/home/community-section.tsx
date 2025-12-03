import Link from "next/link"
import { ChatBox } from "@/components/chat-box"
import { Button } from "@/components/ui/button"

const quickLinks = [
  {
    icon: "💬",
    title: "Diễn đàn",
    description: "Thảo luận, chia sẻ tips và tricks",
    href: "/forum",
    color: "text-blue-500",
  },
  {
    icon: "📖",
    title: "Wiki",
    description: "Kho kiến thức về game và tool",
    href: "/wiki",
    color: "text-green-500",
  },
  {
    icon: "📋",
    title: "Releases",
    description: "Cập nhật phiên bản mới nhất",
    href: "/releases",
    color: "text-purple-500",
  },
]

export function CommunitySection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cộng đồng <span className="text-primary">Âm Dương Sư</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn người chơi, chia sẻ kinh nghiệm và học hỏi lẫn nhau
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Box */}
          <div className="order-2 lg:order-1">
            <ChatBox />
          </div>

          {/* Quick Links */}
          <div className="order-1 lg:order-2 space-y-4">
            <h3 className="text-xl font-semibold mb-6">Khám phá thêm</h3>
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center gap-4 p-4 rounded-xl glass glass-hover transition-all group"
              >
                <div className={`p-3 rounded-lg bg-muted ${link.color}`}>
                  <span className="text-2xl">{link.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <div className="text-muted-foreground group-hover:text-primary transition-colors">→</div>
              </Link>
            ))}

            <div className="pt-4">
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/forum">Tham gia thảo luận</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
