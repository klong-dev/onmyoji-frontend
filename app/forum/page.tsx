import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const metadata: Metadata = {
  title: "Diễn đàn - Onmyoji AutoVN",
  description:
    "Tham gia thảo luận cùng cộng đồng Onmyoji Việt Nam. Chia sẻ kinh nghiệm, hỏi đáp và kết nối với người chơi khác.",
  openGraph: {
    title: "Diễn đàn Onmyoji AutoVN",
    description: "Tham gia thảo luận cùng cộng đồng Onmyoji Việt Nam",
  },
}

const categories = [
  { id: "general", name: "Tổng hợp", count: 234, color: "bg-blue-500", icon: "💬" },
  { id: "guides", name: "Hướng dẫn", count: 89, color: "bg-green-500", icon: "📖" },
  { id: "team-building", name: "Đội hình", count: 156, color: "bg-purple-500", icon: "👥" },
  { id: "pvp", name: "PvP", count: 78, color: "bg-red-500", icon: "⚔️" },
  { id: "events", name: "Sự kiện", count: 45, color: "bg-yellow-500", icon: "🎉" },
  { id: "trading", name: "Giao dịch", count: 123, color: "bg-orange-500", icon: "🔄" },
]

const posts = [
  {
    id: "1",
    title: "Hướng dẫn build Tamamo no Mae cho người mới",
    excerpt: "Chi tiết cách build Tamamo từ A-Z, bao gồm ngự hồn, đội hình và cách sử dụng...",
    category: "guides",
    author: { name: "Seimei", avatar: "/anime-male-onmyoji.jpg" },
    likes: 234,
    comments: 45,
    createdAt: "2 giờ trước",
    isPinned: true,
  },
  {
    id: "2",
    title: "Thảo luận Meta PvP Season 15",
    excerpt: "Các thức thần đang hot trong season này và cách counter hiệu quả...",
    category: "pvp",
    author: { name: "Kagura", avatar: "/anime-female-kagura.jpg" },
    likes: 189,
    comments: 67,
    createdAt: "5 giờ trước",
    isPinned: true,
  },
  {
    id: "3",
    title: "Event mới: Hướng dẫn farm hiệu quả",
    excerpt: "Cách tối ưu stamina và thời gian để farm được nhiều phần thưởng nhất...",
    category: "events",
    author: { name: "Ibaraki", avatar: "/anime-demon-oni.jpg" },
    likes: 156,
    comments: 34,
    createdAt: "1 ngày trước",
    isPinned: false,
  },
  {
    id: "4",
    title: "Chia sẻ đội hình Soul Zone 12",
    excerpt: "Đội hình ổn định để clear Soul Zone 12, phù hợp với nhiều level...",
    category: "team-building",
    author: { name: "Shuten", avatar: "/anime-shuten-doji.jpg" },
    likes: 98,
    comments: 23,
    createdAt: "2 ngày trước",
    isPinned: false,
  },
]

export default function ForumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Diễn đàn</h1>
          <p className="mt-2 text-muted-foreground">Thảo luận, chia sẻ kinh nghiệm cùng cộng đồng Onmyoji</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/forum/new">
            <span>➕</span>
            Tạo bài viết
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-24 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/forum?category=${cat.id}`}
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-foreground">{cat.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="mt-4 border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-serif">
                <span className="text-primary">📊</span>
                Thống kê
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tổng bài viết</span>
                <span className="font-medium text-foreground">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Thành viên</span>
                <span className="font-medium text-foreground">5,678</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Online</span>
                <span className="font-medium text-green-500">89</span>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Posts List */}
        <div className="lg:col-span-3 space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="border-border bg-card transition-colors hover:bg-accent/50">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {post.isPinned && (
                        <Badge variant="default" className="bg-primary text-primary-foreground">
                          📌 Ghim
                        </Badge>
                      )}
                      <Badge variant="outline">{categories.find((c) => c.id === post.category)?.name}</Badge>
                    </div>
                    <Link href={`/forum/${post.id}`}>
                      <h3 className="mt-2 text-lg font-semibold text-foreground hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{post.author.name}</span>
                      <span className="flex items-center gap-1">🕐 {post.createdAt}</span>
                      <span className="flex items-center gap-1">❤️ {post.likes}</span>
                      <span className="flex items-center gap-1">💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
