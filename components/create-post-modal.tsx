"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { forumApi } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3020/api";

const categories = [
  { id: "tips", name: "Tips", icon: "💡" },
  { id: "tricks", name: "Tricks", icon: "🎯" },
  { id: "guide", name: "Hướng dẫn", icon: "📖" },
  { id: "question", name: "Hỏi đáp", icon: "❓" },
  { id: "discussion", name: "Thảo luận", icon: "💬" },
  { id: "bug", name: "Bug", icon: "🐛" },
  { id: "suggestion", name: "Góp ý", icon: "💡" },
];

interface CreatePostModalProps {
  onPostCreated?: () => void;
  children?: React.ReactNode;
}

export function CreatePostModal({ onPostCreated, children }: CreatePostModalProps) {
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("discussion");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
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
        // Insert image markdown at cursor position
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
      setError("Vui lòng đăng nhập để tạo bài viết");
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError("Vui lòng điền tiêu đề và nội dung");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await forumApi.createPost(
        {
          title: title.trim(),
          content: content.trim(),
          category,
          tags,
        },
        token
      );

      // Reset form
      setTitle("");
      setContent("");
      setCategory("discussion");
      setTags([]);
      setOpen(false);
      onPostCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tạo bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button className="gap-2">
              <span>➕</span>
              Tạo bài viết
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Yêu cầu đăng nhập</DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">Vui lòng đăng nhập để tạo bài viết</p>
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
          <Button className="gap-2">
            <span>➕</span>
            Tạo bài viết
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Tạo bài viết mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="title">Tiêu đề *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài viết..." maxLength={200} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Danh mục</Label>
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
            <Label htmlFor="content">Nội dung *</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nhập nội dung bài viết... (hỗ trợ Markdown)" rows={10} className="resize-none" />
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                {uploadingImage ? "Đang tải..." : "📷 Thêm hình ảnh"}
              </Button>
              <span className="text-xs text-muted-foreground">Hỗ trợ: jpg, png, gif, webp (max 5MB)</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (tối đa 5)</Label>
            <div className="flex gap-2">
              <Input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Nhập tag và Enter..." disabled={tags.length >= 5} />
              <Button type="button" variant="outline" onClick={handleAddTag} disabled={tags.length >= 5 || !tagInput.trim()}>
                Thêm
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground" onClick={() => handleRemoveTag(tag)}>
                    {tag} ✕
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim() || !content.trim()}>
              {isLoading ? "Đang tạo..." : "Đăng bài"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
