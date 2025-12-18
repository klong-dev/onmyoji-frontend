"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { githubApi, type Release } from "@/lib/api";

const typeConfig = {
  major: { label: "Major", color: "bg-red-500" },
  minor: { label: "Minor", color: "bg-blue-500" },
  patch: { label: "Patch", color: "bg-green-500" },
  hotfix: { label: "Hotfix", color: "bg-orange-500" },
};

export function ReleasesListClient() {
  const [releases, setReleases] = useState<Release[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReleases = async () => {
    try {
      setIsLoading(true);
      const data = await githubApi.getReleases();
      setReleases(data?.releases || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách releases");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-muted-foreground">Đang tải lịch sử cập nhật...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">❌</span>
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchReleases} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  if ((releases?.length || 0) === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">📦</span>
        <p className="text-muted-foreground">Chưa có bản cập nhật nào</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative space-y-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-border md:before:left-1/2 md:before:-translate-x-1/2">
        {releases.map((release, index) => (
          <div key={release.id} className={`relative flex flex-col gap-4 pl-12 md:flex-row md:gap-8 md:pl-0 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
            {/* Dot */}
            <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary text-xs md:left-1/2 md:-translate-x-1/2">🔀</div>

            {/* Content */}
            <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className={`flex items-center gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                    <Badge className={typeConfig[release.type]?.color || "bg-gray-500"}>{release.tagName}</Badge>
                    <Badge variant="outline">{typeConfig[release.type]?.label || release.type}</Badge>
                  </div>
                  <CardTitle className="font-serif">{release.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">📅 {new Date(release.publishedAt).toLocaleDateString("vi-VN")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`prose prose-sm dark:prose-invert max-w-none ${index % 2 === 0 ? "md:text-right" : ""}`}
                    dangerouslySetInnerHTML={{
                      __html: release.body
                        .split("\n")
                        .filter((line) => line.trim())
                        .map((line) => `<p class="text-sm text-muted-foreground">• ${line.replace(/^[-*]\s*/, "")}</p>`)
                        .join(""),
                    }}
                  />
                  {release.htmlUrl && (
                    <a href={release.htmlUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-primary hover:underline">
                      Xem trên GitHub →
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Spacer for alternating layout */}
            <div className="hidden flex-1 md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
