import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ForumPostsClient } from "@/components/forum-posts-client";
import { CreatePostModal } from "@/components/create-post-modal";

export const metadata: Metadata = {
  title: "Diễn đàn - Onmyoji AutoVN",
  description: "Tham gia thảo luận cùng cộng đồng Onmyoji Việt Nam. Chia sẻ kinh nghiệm, hỏi đáp và kết nối với người chơi khác.",
  openGraph: {
    title: "Diễn đàn Onmyoji AutoVN",
    description: "Tham gia thảo luận cùng cộng đồng Onmyoji Việt Nam",
  },
};

const categories = [
  { id: "tips", name: "Tips", icon: "💡" },
  { id: "tricks", name: "Tricks", icon: "🎯" },
  { id: "guide", name: "Hướng dẫn", icon: "📖" },
  { id: "question", name: "Hỏi đáp", icon: "❓" },
  { id: "discussion", name: "Thảo luận", icon: "💬" },
  { id: "bug", name: "Bug", icon: "🐛" },
  { id: "suggestion", name: "Góp ý", icon: "💡" },
];

interface ForumPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export default async function ForumPage({ searchParams }: ForumPageProps) {
  const params = await searchParams;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Diễn đàn</h1>
          <p className="mt-2 text-muted-foreground">Thảo luận, chia sẻ kinh nghiệm cùng cộng đồng Onmyoji</p>
        </div>
        <CreatePostModal />
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Card className="sticky top-24 border-border bg-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Danh mục</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/forum" className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${!params.category ? "bg-accent" : ""}`}>
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span className="text-foreground">Tất cả</span>
                </div>
              </Link>
              {categories.map((cat) => (
                <Link key={cat.id} href={`/forum?category=${cat.id}`} className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent ${params.category === cat.id ? "bg-accent" : ""}`}>
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-foreground">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Posts List */}
        <div className="lg:col-span-3">
          <ForumPostsClient category={params.category} search={params.search} />
        </div>
      </div>
    </div>
  );
}
