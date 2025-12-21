"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { releasesApi, type ReleaseNote } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3020/api";

export default function DownloadPage() {
  const [latestRelease, setLatestRelease] = useState<ReleaseNote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await releasesApi.getLatest();
        setLatestRelease(data.release);
      } catch (error) {
        console.error("Failed to fetch latest release:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleDownload = () => {
    // Trigger download from backend API
    window.location.href = `${API_URL}/releases/download/latest`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4" variant="secondary">
          {isLoading ? "Đang tải..." : latestRelease ? `Phiên bản ${latestRelease.version}` : "Phiên bản mới nhất"}
        </Badge>
        <h1 className="font-serif text-4xl font-bold text-foreground md:text-5xl mb-4">Tải xuống Onmyoji AutoVN</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Phần mềm hỗ trợ tự động hóa game Onmyoji - Tiết kiệm thời gian, tối ưu hiệu quả</p>

        {/* Download Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button 
            size="lg" 
            className="gap-2 text-lg px-8" 
            onClick={handleDownload}
            disabled={isLoading || !latestRelease}
          >
            <span>⬇️</span>
            {isLoading ? "Đang tải..." : "Tải xuống (Windows)"}
          </Button>
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <a href="https://github.com/klong-dev/OnmyojiAutoVN" target="_blank" rel="noopener noreferrer">
              <span>📦</span>
              Source Code (GitHub)
            </a>
          </Button>
        </div>

        {/* Version Info */}
        {latestRelease && (
          <div className="mb-4 text-sm text-muted-foreground">
            <p>📅 Cập nhật: {new Date(latestRelease.publishedAt || latestRelease.createdAt).toLocaleDateString('vi-VN')}</p>
            {latestRelease.downloadCount !== undefined && (
              <p>📊 Lượt tải: {latestRelease.downloadCount.toLocaleString()}</p>
            )}
          </div>
        )}

        {/* Requirements */}
        <div className="inline-flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">Windows 10/11</Badge>
          <Badge variant="outline">Python 3.10+</Badge>
          <Badge variant="outline">ADB Driver</Badge>
        </div>
      </div>

      {/* Tabs for Instructions */}
      <Tabs defaultValue="install" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="install">📥 Cài đặt</TabsTrigger>
          <TabsTrigger value="setup">⚙️ Thiết lập</TabsTrigger>
          <TabsTrigger value="usage">🎮 Sử dụng</TabsTrigger>
        </TabsList>

        {/* Installation Tab */}
        <TabsContent value="install" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Hướng dẫn cài đặt</CardTitle>
              <CardDescription>Các bước cài đặt Onmyoji AutoVN trên máy tính</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Tải xuống bản release mới nhất</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Click nút bên dưới để tải file <code className="bg-muted px-1.5 py-0.5 rounded">{latestRelease ? `OnmyojiAutoVN-${latestRelease.version}.zip` : 'OnmyojiAutoVN.zip'}</code>
                  </p>
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!latestRelease}>
                    Tải xuống ngay →
                  </Button>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Giải nén file</h3>
                  <p className="text-muted-foreground text-sm">
                    Giải nén file zip vào thư mục bạn muốn (ví dụ: <code className="bg-muted px-1.5 py-0.5 rounded">D:\OnmyojiAutoVN</code>)
                  </p>
                  <p className="text-amber-500 text-sm mt-1">⚠️ Không giải nén vào thư mục Program Files hoặc Desktop</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Chạy file cài đặt</h3>
                  <p className="text-muted-foreground text-sm">
                    Mở thư mục đã giải nén và chạy file <code className="bg-muted px-1.5 py-0.5 rounded">console.bat</code> để cài đặt các dependencies
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Cài đặt ADB Driver (nếu chưa có)</h3>
                  <p className="text-muted-foreground text-sm mb-2">ADB Driver cần thiết để kết nối với giả lập/điện thoại</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://developer.android.com/studio/releases/platform-tools" target="_blank" rel="noopener noreferrer">
                      Tải ADB Platform Tools →
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Setup Tab */}
        <TabsContent value="setup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Thiết lập ban đầu</CardTitle>
              <CardDescription>Cấu hình giả lập và kết nối</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Emulator Setup */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Cài đặt giả lập</h3>
                  <p className="text-muted-foreground text-sm mb-2">Khuyến nghị sử dụng các giả lập sau:</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">LDPlayer (Khuyến nghị)</Badge>
                    <Badge variant="secondary">Bluestacks 5</Badge>
                    <Badge variant="secondary">MuMu Player</Badge>
                    <Badge variant="secondary">NoxPlayer</Badge>
                  </div>
                </div>
              </div>

              {/* Resolution */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Cấu hình độ phân giải</h3>
                  <p className="text-muted-foreground text-sm">
                    Đặt độ phân giải giả lập: <code className="bg-muted px-1.5 py-0.5 rounded">1280x720</code> hoặc <code className="bg-muted px-1.5 py-0.5 rounded">1920x1080</code>
                  </p>
                  <p className="text-amber-500 text-sm mt-1">⚠️ DPI nên đặt là 240 hoặc 320</p>
                </div>
              </div>

              {/* ADB Connection */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Bật ADB Debugging</h3>
                  <p className="text-muted-foreground text-sm">Trong cài đặt giả lập, bật tùy chọn &ldquo;ADB debugging&rdquo; hoặc &ldquo;Remote connection&rdquo;</p>
                </div>
              </div>

              {/* Config File */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-2">Cấu hình file config</h3>
                  <p className="text-muted-foreground text-sm">
                    Mở file <code className="bg-muted px-1.5 py-0.5 rounded">config/deploy.yaml</code> và chỉnh sửa thông tin kết nối ADB
                  </p>
                  <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
                    {`Emulator:
  Serial: 127.0.0.1:5555
  PackageName: com.netease.onmyoji`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Hướng dẫn sử dụng</CardTitle>
              <CardDescription>Cách sử dụng Onmyoji AutoVN</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Start */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-2">Khởi động chương trình</h3>
                  <p className="text-muted-foreground text-sm">
                    Chạy file <code className="bg-muted px-1.5 py-0.5 rounded">gui.py</code> hoặc <code className="bg-muted px-1.5 py-0.5 rounded">console.bat</code> để mở giao diện
                  </p>
                </div>
              </div>

              {/* Select Task */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-2">Chọn tác vụ</h3>
                  <p className="text-muted-foreground text-sm mb-2">Trong giao diện, chọn các tác vụ bạn muốn tự động hóa:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span>🐍</span> Farm Orochi
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👹</span> Farm Soul
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎭</span> Realm Raid
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📜</span> Daily Quests
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎪</span> Events
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⚔️</span> Duel
                    </div>
                  </div>
                </div>
              </div>

              {/* Run */}
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-2">Bắt đầu chạy</h3>
                  <p className="text-muted-foreground text-sm">Nhấn nút &ldquo;Start&rdquo; để bắt đầu tự động hóa. Chương trình sẽ tự động thực hiện các tác vụ đã chọn.</p>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <span>💡</span> Mẹo sử dụng
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Để giả lập chạy ở chế độ nền để tiết kiệm tài nguyên</li>
                  <li>• Kiểm tra kết nối ADB trước khi chạy</li>
                  <li>• Đảm bảo game đã đăng nhập và ở màn hình chính</li>
                  <li>• Theo dõi log để phát hiện lỗi sớm</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="font-serif text-2xl font-bold text-center mb-6">Câu hỏi thường gặp</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Chương trình có an toàn không?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Chương trình là mã nguồn mở, bạn có thể kiểm tra source code trên GitHub. Không thu thập dữ liệu cá nhân.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Có bị ban không?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Rủi ro ban luôn tồn tại khi sử dụng tool. Khuyến nghị sử dụng ở mức độ hợp lý và không lạm dụng.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hỗ trợ điện thoại thật không?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Có, chương trình hỗ trợ cả điện thoại Android thật thông qua ADB wireless hoặc USB debugging.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Gặp lỗi thì làm sao?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Kiểm tra log lỗi, tham gia Discord/Forum để được hỗ trợ, hoặc tạo issue trên GitHub.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
