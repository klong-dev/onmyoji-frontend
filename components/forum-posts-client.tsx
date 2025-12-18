"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { forumApi, type ForumPost } from "@/lib/api";

const categories = [
  { id: "tips", name: "Tips", icon: "💡" },
  { id: "tricks", name: "Tricks", icon: "🎯" },
  { id: "guide", name: "Hướng dẫn", icon: "📖" },
  { id: "question", name: "Hỏi đáp", icon: "❓" },
  { id: "discussion", name: "Thảo luận", icon: "💬" },
  { id: "bug", name: "Bug", icon: "🐛" },
  { id: "suggestion", name: "Góp ý", icon: "💡" },
];

interface ForumPostsClientProps {
  category?: string;
  search?: string;
}

export function ForumPostsClient({ category, search }: ForumPostsClientProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await forumApi.getPosts({ category, search });
      setPosts(data?.posts || []);
      setTotal(data?.total || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách bài viết");
    } finally {
      setIsLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Vừa xong";
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-muted-foreground">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">❌</span>
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchPosts} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  if ((posts?.length || 0) === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">📭</span>
        <p className="text-muted-foreground">Chưa có bài viết nào</p>
        <Button asChild>
          <Link href="/forum/new">Tạo bài viết đầu tiên</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">Tìm thấy {total} bài viết</p>
      {posts.map((post) => (
        <Card key={post.id} className="border-border bg-card transition-colors hover:bg-accent/50">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt={post.authorName} />
                <AvatarFallback>{post.authorName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    {categories.find((c) => c.id === post.category)?.icon} {categories.find((c) => c.id === post.category)?.name || post.category}
                  </Badge>
                  {post.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Link href={`/forum/${post.id}`}>
                  <h3 className="mt-2 text-lg font-semibold text-foreground hover:text-primary transition-colors">{post.title}</h3>
                </Link>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content.replace(/<[^>]*>/g, "").substring(0, 200)}...</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{post.authorDisplayName || post.authorName}</span>
                  <span className="flex items-center gap-1">🕐 {formatTime(post.createdAt)}</span>
                  <span className="flex items-center gap-1">❤️ {post.likes}</span>
                  <span className="flex items-center gap-1">💬 {post.commentsCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
