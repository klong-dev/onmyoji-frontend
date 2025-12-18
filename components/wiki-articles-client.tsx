"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { wikiApi, type WikiArticle } from "@/lib/api";

const categoryConfig: Record<string, { name: string; icon: string }> = {
  shikigami: { name: "Thức Thần", icon: "✨" },
  skill: { name: "Kỹ Năng", icon: "⚡" },
  item: { name: "Vật Phẩm", icon: "🎁" },
  event: { name: "Sự Kiện", icon: "🎉" },
  guide: { name: "Hướng Dẫn", icon: "📖" },
  translation: { name: "Dịch Thuật", icon: "🌐" },
  other: { name: "Khác", icon: "📚" },
};

interface WikiArticlesClientProps {
  category?: string;
}

export function WikiArticlesClient({ category }: WikiArticlesClientProps) {
  const [articles, setArticles] = useState<WikiArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const data = await wikiApi.getArticles(category);
      setArticles(data?.articles || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-muted-foreground">Đang tải bài viết wiki...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">❌</span>
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchArticles} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  if ((articles?.length || 0) === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">📭</span>
        <p className="text-muted-foreground">Chưa có bài viết wiki nào</p>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl font-bold text-foreground">{category ? categoryConfig[category]?.name || "Bài viết" : "Bài Viết Mới"}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.id} href={`/wiki/${article.slug}`}>
            <Card className="border-border bg-card transition-colors hover:bg-accent/50 h-full">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">{categoryConfig[article.category]?.icon || "📚"}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground line-clamp-1">{article.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{article.excerpt || article.content?.replace(/<[^>]*>/g, "").substring(0, 100)}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {categoryConfig[article.category]?.name || article.category}
                    </Badge>
                    <span>✍️ {article.authorName}</span>
                    <span>📅 {new Date(article.updatedAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
