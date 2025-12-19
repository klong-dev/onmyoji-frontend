"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { releasesApi, ReleaseNote, Pagination } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Plus, MoreHorizontal, Pencil, Trash2, Download, Upload, FileArchive, Eye, EyeOff, Loader2, Package, FileDown, RefreshCw, X } from "lucide-react";

interface Stats {
  total: number;
  published: number;
  draft: number;
  totalDownloads: number;
}

const releaseTypes = [
  { value: "major", label: "Major" },
  { value: "minor", label: "Minor" },
  { value: "patch", label: "Patch" },
  { value: "hotfix", label: "Hotfix" },
  { value: "oasx", label: "OASX" },
  { value: "oas", label: "OAS" },
];

const releaseTypeColors: Record<string, string> = {
  major: "bg-purple-500",
  minor: "bg-blue-500",
  patch: "bg-green-500",
  hotfix: "bg-red-500",
  oasx: "bg-amber-500",
  oas: "bg-teal-500",
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminReleasesPage() {
  const { token } = useAuth();
  const [releases, setReleases] = useState<ReleaseNote[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ReleaseNote | null>(null);

  // Form states
  const [selectedRelease, setSelectedRelease] = useState<ReleaseNote | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Create form
  const [createForm, setCreateForm] = useState({
    version: "",
    title: "",
    content: "",
    type: "minor" as const,
    downloadUrl: "",
    changelogUrl: "",
    isPublished: true,
  });
  const [createFile, setCreateFile] = useState<File | null>(null);

  // Edit form
  const [editForm, setEditForm] = useState({
    version: "",
    title: "",
    content: "",
    type: "minor" as const,
    downloadUrl: "",
    changelogUrl: "",
    isPublished: true,
  });

  // Upload form
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const fetchReleases = useCallback(async (page = 1) => {
    if (!token) return;
    try {
      setIsLoading(true);
      setError(null);
      const [releasesData, statsData] = await Promise.all([
        releasesApi.adminList(token, { page, limit: 20 }),
        releasesApi.adminStats(token),
      ]);
      setReleases(releasesData.releases);
      setPagination(releasesData.pagination);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch releases");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const handleCreate = async () => {
    if (!token) return;
    if (!createForm.version || !createForm.title || !createForm.content) {
      alert("Vui lòng điền đầy đủ Version, Title và Content");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("version", createForm.version);
      formData.append("title", createForm.title);
      formData.append("content", createForm.content);
      formData.append("type", createForm.type);
      formData.append("isPublished", createForm.isPublished.toString());
      if (createForm.downloadUrl) formData.append("downloadUrl", createForm.downloadUrl);
      if (createForm.changelogUrl) formData.append("changelogUrl", createForm.changelogUrl);
      if (createFile) formData.append("file", createFile);

      await releasesApi.adminCreate(formData, token);
      setIsCreateOpen(false);
      resetCreateForm();
      fetchReleases();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create release");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!token || !selectedRelease) return;

    setIsSubmitting(true);
    try {
      await releasesApi.adminUpdate(selectedRelease.id, editForm, token);
      setIsEditOpen(false);
      setSelectedRelease(null);
      fetchReleases();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update release");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadFile = async () => {
    if (!token || !selectedRelease || !uploadFile) return;

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate progress (actual progress tracking would need XMLHttpRequest)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      await releasesApi.adminUploadFile(selectedRelease.id, uploadFile, token);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        setIsUploadOpen(false);
        setSelectedRelease(null);
        setUploadFile(null);
        setUploadProgress(0);
        fetchReleases();
      }, 500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to upload file");
      setUploadProgress(0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (release: ReleaseNote) => {
    if (!token) return;
    if (!confirm("Bạn có chắc muốn xóa file này?")) return;

    try {
      await releasesApi.adminDeleteFile(release.id, token);
      fetchReleases();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete file");
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteTarget) return;

    try {
      await releasesApi.adminDelete(deleteTarget.id, token);
      setDeleteTarget(null);
      fetchReleases();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete release");
    }
  };

  const openEditDialog = (release: ReleaseNote) => {
    setSelectedRelease(release);
    setEditForm({
      version: release.version,
      title: release.title,
      content: release.content,
      type: release.type as typeof editForm.type,
      downloadUrl: release.downloadUrl || "",
      changelogUrl: release.changelogUrl || "",
      isPublished: release.isPublished,
    });
    setIsEditOpen(true);
  };

  const openUploadDialog = (release: ReleaseNote) => {
    setSelectedRelease(release);
    setUploadFile(null);
    setIsUploadOpen(true);
  };

  const resetCreateForm = () => {
    setCreateForm({
      version: "",
      title: "",
      content: "",
      type: "minor",
      downloadUrl: "",
      changelogUrl: "",
      isPublished: true,
    });
    setCreateFile(null);
  };

  if (isLoading && releases.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="h-8 w-8 text-primary" />
            Quản lý Releases
          </h1>
          <p className="text-muted-foreground mt-1">Upload và quản lý các bản release cho người dùng tải về</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchReleases()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetCreateForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Release mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo Release mới</DialogTitle>
                <DialogDescription>Tạo bản release mới với file tải về</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="version">Version *</Label>
                    <Input id="version" placeholder="v1.0.0" value={createForm.version} onChange={(e) => setCreateForm({ ...createForm, version: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại</Label>
                    <Select value={createForm.type} onValueChange={(v) => setCreateForm({ ...createForm, type: v as typeof createForm.type })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {releaseTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề *</Label>
                  <Input id="title" placeholder="Cập nhật tính năng mới..." value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Nội dung (Markdown) *</Label>
                  <Textarea id="content" placeholder="Mô tả các thay đổi..." className="min-h-[150px] font-mono text-sm" value={createForm.content} onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File tải về (.zip, .rar, .7z, .exe)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      id="file"
                      type="file"
                      accept=".zip,.rar,.7z,.tar,.gz,.exe,.msi"
                      className="hidden"
                      onChange={(e) => setCreateFile(e.target.files?.[0] || null)}
                    />
                    {createFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileArchive className="h-8 w-8 text-primary" />
                        <div className="text-left">
                          <p className="font-medium">{createFile.name}</p>
                          <p className="text-sm text-muted-foreground">{formatFileSize(createFile.size)}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setCreateFile(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="file" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Kéo thả hoặc click để chọn file</p>
                        <p className="text-xs text-muted-foreground mt-1">Tối đa 500MB</p>
                      </label>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">Download URL (thay thế file)</Label>
                  <Input id="downloadUrl" type="url" placeholder="https://..." value={createForm.downloadUrl} onChange={(e) => setCreateForm({ ...createForm, downloadUrl: e.target.value })} />
                  <p className="text-xs text-muted-foreground">Nếu có file upload, URL này sẽ được dùng làm fallback</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="changelogUrl">Changelog URL</Label>
                  <Input id="changelogUrl" type="url" placeholder="https://..." value={createForm.changelogUrl} onChange={(e) => setCreateForm({ ...createForm, changelogUrl: e.target.value })} />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isPublished" checked={createForm.isPublished} onCheckedChange={(v) => setCreateForm({ ...createForm, isPublished: v })} />
                  <Label htmlFor="isPublished">Công khai ngay</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                  Tạo Release
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tổng releases</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Đã công khai</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-500">{stats.published}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bản nháp</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-500">{stats.draft}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tổng lượt tải</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-500">{stats.totalDownloads}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Releases Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Releases</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Version</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>File</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lượt tải</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {releases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    Chưa có release nào
                  </TableCell>
                </TableRow>
              ) : (
                releases.map((release) => (
                  <TableRow key={release.id}>
                    <TableCell className="font-mono font-medium">{release.version}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{release.title}</TableCell>
                    <TableCell>
                      <Badge className={`${releaseTypeColors[release.type] || "bg-gray-500"} text-white`}>
                        {release.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {release.fileName ? (
                        <div className="flex items-center gap-2">
                          <FileArchive className="h-4 w-4 text-primary" />
                          <div className="text-sm">
                            <p className="max-w-[120px] truncate">{release.fileName}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(release.fileSize || 0)}</p>
                          </div>
                        </div>
                      ) : release.downloadUrl ? (
                        <Badge variant="outline">External URL</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {release.isPublished ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                          <Eye className="h-3 w-3 mr-1" />
                          Công khai
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/30">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Ẩn
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {release.downloadCount || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(release.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(release)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openUploadDialog(release)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload file
                          </DropdownMenuItem>
                          {release.fileName && (
                            <>
                              <DropdownMenuItem asChild>
                                <a href={releasesApi.getDownloadUrl(release.id)} target="_blank" rel="noopener noreferrer">
                                  <FileDown className="h-4 w-4 mr-2" />
                                  Tải file
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteFile(release)} className="text-orange-500">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa file
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => setDeleteTarget(release)} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa release
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Trang {pagination.page} / {pagination.totalPages} (Tổng: {pagination.total})
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={pagination.page <= 1} onClick={() => fetchReleases(pagination.page - 1)}>
                  Trước
                </Button>
                <Button variant="outline" size="sm" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchReleases(pagination.page + 1)}>
                  Sau
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Release</DialogTitle>
            <DialogDescription>Cập nhật thông tin release</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-version">Version</Label>
                <Input id="edit-version" value={editForm.version} onChange={(e) => setEditForm({ ...editForm, version: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Loại</Label>
                <Select value={editForm.type} onValueChange={(v) => setEditForm({ ...editForm, type: v as typeof editForm.type })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {releaseTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Tiêu đề</Label>
              <Input id="edit-title" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-content">Nội dung (Markdown)</Label>
              <Textarea id="edit-content" className="min-h-[150px] font-mono text-sm" value={editForm.content} onChange={(e) => setEditForm({ ...editForm, content: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-downloadUrl">Download URL</Label>
              <Input id="edit-downloadUrl" type="url" value={editForm.downloadUrl} onChange={(e) => setEditForm({ ...editForm, downloadUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-changelogUrl">Changelog URL</Label>
              <Input id="edit-changelogUrl" type="url" value={editForm.changelogUrl} onChange={(e) => setEditForm({ ...editForm, changelogUrl: e.target.value })} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit-isPublished" checked={editForm.isPublished} onCheckedChange={(v) => setEditForm({ ...editForm, isPublished: v })} />
              <Label htmlFor="edit-isPublished">Công khai</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload file cho {selectedRelease?.version}</DialogTitle>
            <DialogDescription>
              {selectedRelease?.fileName
                ? `File hiện tại: ${selectedRelease.fileName} (${formatFileSize(selectedRelease.fileSize || 0)}). Upload file mới sẽ thay thế file cũ.`
                : "Chưa có file nào được upload cho release này"}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors">
              <input
                id="upload-file"
                type="file"
                accept=".zip,.rar,.7z,.tar,.gz,.exe,.msi"
                className="hidden"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
              {uploadFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileArchive className="h-12 w-12 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{uploadFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(uploadFile.size)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setUploadFile(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="upload-file" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="font-medium">Kéo thả hoặc click để chọn file</p>
                  <p className="text-sm text-muted-foreground mt-1">.zip, .rar, .7z, .exe, .msi - Tối đa 500MB</p>
                </label>
              )}
            </div>
            {uploadProgress > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Đang upload...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadOpen(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button onClick={handleUploadFile} disabled={!uploadFile || isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa release <strong>{deleteTarget?.version}</strong>? Hành động này không thể hoàn tác.
              {deleteTarget?.fileName && " File đính kèm cũng sẽ bị xóa."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

