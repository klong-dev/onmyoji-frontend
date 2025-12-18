"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/auth-context";
import { wikiApi } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3020/api";

const categories = [
  { id: "shikigami", name: "Thức Thần", icon: "✨" },
  { id: "skill", name: "Kỹ Năng", icon: "⚡" },
  { id: "item", name: "Vật Phẩm", icon: "🎁" },
  { id: "event", name: "Sự Kiện", icon: "🎉" },
  { id: "guide", name: "Hướng Dẫn", icon: "📖" },
  { id: "translation", name: "Dịch Thuật", icon: "🌐" },
  { id: "other", name: "Khác", icon: "📚" },
];

interface ContributeWikiModalProps {
  onArticleCreated?: () => void;
  children?: React.ReactNode;
}

export function ContributeWikiModal({ onArticleCreated, children }: ContributeWikiModalProps) {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("guide");
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !token) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", files[0]);

      const res = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        const imageMarkdown = `\n![${files[0].name}](${API_URL.replace("/api", "")}${data.data.url})\n`;
        setContent((prev) => prev + imageMarkdown);
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Vui lòng đăng nhập để đóng góp wiki");
      return;
    }

    if (!title.trim() || !content.trim() || !slug.trim()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await wikiApi.createArticle(
        {
          title: title.trim(),
          slug: slug.trim(),
          content: content.trim(),
          category,
        },
        token
      );

      // Reset form
      setTitle("");
      setSlug("");
      setContent("");
      setCategory("guide");
      setOpen(false);
      onArticleCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo bài wiki");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="outline" className="gap-2">
              <span>✍️</span>
              Đóng góp Wiki
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để đóng góp wiki</p>
            <Button asChild>
              <a href="/login">Đăng nhập</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <span>✍️</span>
            Đóng góp Wiki
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Đóng góp bài Wiki</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="wiki-title">Tiêu đề *</Label>
            <Input id="wiki-title" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Ví dụ: Hướng dẫn farm Orochi..." maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wiki-slug">Slug (URL)</Label>
            <Input id="wiki-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="huong-dan-farm-orochi" />
            <p className="text-xs text-muted-foreground">URL: /wiki/{slug || "slug-bai-viet"}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wiki-category">Danh mục</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="wiki-content">Nội dung *</Label>
            <Textarea id="wiki-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập nội dung bài wiki... (hỗ trợ Markdown)" rows={12} className="resize-none font-mono text-sm" />
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                {uploadingImage ? "Đang tải..." : "📷 Thêm hình ảnh"}
              </Button>
              <span className="text-xs text-muted-foreground">Hỗ trợ Markdown: **bold**, *italic*, # heading, - list</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim() || !content.trim() || !slug.trim()}>
              {isLoading ? "Đang gửi..." : "Gửi đóng góp"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
