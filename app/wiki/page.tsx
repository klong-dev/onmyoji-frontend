import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Wiki - Onmyoji AutoVN",
  description: "Thư viện kiến thức đầy đủ về Onmyoji. Tìm hiểu về thức thần, ngự hồn, đội hình và chiến thuật.",
  openGraph: {
    title: "Wiki Onmyoji AutoVN",
    description: "Thư viện kiến thức đầy đủ về Onmyoji",
  },
}

const wikiCategories = [
  {
    id: "shikigami",
    name: "Thức Thần",
    icon: "✨",
    count: 300,
    description: "Danh sách và thông tin chi tiết tất cả thức thần",
  },
  {
    id: "souls",
    name: "Ngự Hồn",
    icon: "🛡️",
    count: 50,
    description: "Hướng dẫn về các bộ ngự hồn và cách sử dụng",
  },
  {
    id: "teams",
    name: "Đội Hình",
    icon: "👥",
    count: 80,
    description: "Các đội hình meta và cách build",
  },
  {
    id: "pvp",
    name: "PvP",
    icon: "⚔️",
    count: 45,
    description: "Chiến thuật và tier list PvP",
  },
]

const featuredShikigami = [
  {
    name: "Tamamo no Mae",
    rarity: "SSR",
    role: "DPS",
    image: "/tamamo-no-mae-onmyoji-fox-spirit.jpg",
  },
  {
    name: "Ibaraki Doji",
    rarity: "SSR",
    role: "DPS",
    image: "/ibaraki-doji-onmyoji-demon.jpg",
  },
  {
    name: "Kagura",
    rarity: "SSR",
    role: "Support",
    image: "/kagura-onmyoji-miko.jpg",
  },
  {
    name: "Kaguya",
    rarity: "SP",
    role: "Support",
    image: "/kaguya-onmyoji-princess.jpg",
  },
  {
    name: "Shuten Doji",
    rarity: "SSR",
    role: "DPS",
    image: "/shuten-doji-onmyoji-demon.jpg",
  },
  {
    name: "Yamata no Orochi",
    rarity: "SP",
    role: "DPS",
    image: "/orochi-onmyoji-serpent-dragon.jpg",
  },
]

const recentArticles = [
  { title: "Hướng dẫn Tamamo no Mae chi tiết", category: "shikigami", views: 1234 },
  { title: "Top 10 ngự hồn PvE hiệu quả nhất", category: "souls", views: 987 },
  { title: "Đội hình Soul Zone 12 ổn định", category: "teams", views: 756 },
  { title: "Tier List PvP Season 15", category: "pvp", views: 654 },
]

const rarityColors = {
  SSR: "bg-gradient-to-r from-amber-500 to-yellow-400 text-black",
  SP: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
  SR: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white",
}

export default function WikiPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Wiki Onmyoji</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Thư viện kiến thức đầy đủ về thức thần, ngự hồn, đội hình và chiến thuật
        </p>

        {/* Search */}
        <div className="mx-auto mt-6 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">🔍</span>
            <Input placeholder="Tìm kiếm wiki..." className="pl-10" />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wikiCategories.map((cat) => (
          <Link key={cat.id} href={`/wiki/${cat.id}`}>
            <Card className="group border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl transition-colors group-hover:bg-primary">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} bài viết</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured Shikigami */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">Thức Thần Nổi Bật</h2>
          <Link href="/wiki/shikigami" className="text-sm text-primary hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {featuredShikigami.map((shiki) => (
            <Link key={shiki.name} href={`/wiki/shikigami/${shiki.name.toLowerCase().replace(/ /g, "-")}`}>
              <Card className="group overflow-hidden border-border bg-card transition-all hover:border-primary hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-muted to-muted/50">
                  <Image
                    src={shiki.image || "/placeholder.svg"}
                    alt={shiki.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <CardContent className="p-3 text-center">
                  <Badge className={`mb-1 text-xs ${rarityColors[shiki.rarity as keyof typeof rarityColors]}`}>
                    {shiki.rarity}
                  </Badge>
                  <h3 className="text-sm font-medium text-foreground line-clamp-1">{shiki.name}</h3>
                  <p className="text-xs text-muted-foreground">{shiki.role}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-foreground">Bài Viết Mới</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recentArticles.map((article, index) => (
            <Card key={index} className="border-border bg-card transition-colors hover:bg-accent/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">📚</div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{article.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {wikiCategories.find((c) => c.id === article.category)?.name}
                    </Badge>
                    <span>👁️ {article.views} lượt xem</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
