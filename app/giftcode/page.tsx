import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GiftcodeListClient } from "@/components/giftcode-list-client";

export const metadata: Metadata = {
  title: "Giftcode - Onmyoji AutoVN",
  description: "Tổng hợp và cập nhật giftcode Onmyoji mới nhất. Nhận ngay phần thưởng miễn phí!",
  openGraph: {
    title: "Giftcode Onmyoji - Cập nhật mới nhất",
    description: "Tổng hợp và cập nhật giftcode Onmyoji mới nhất",
  },
};

export default function GiftcodePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">🎁</div>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Giftcode Onmyoji</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Tổng hợp các mã giftcode còn hiệu lực. Nhấn để sao chép và nhận thưởng ngay!</p>
      </div>

      {/* Info Card */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-4">
          <span className="mt-0.5 text-xl text-primary">ℹ️</span>
          <div>
            <h3 className="font-medium text-foreground">Hướng dẫn sử dụng</h3>
            <p className="text-sm text-muted-foreground">Nhấn vào nút "Sao chép" để copy mã, sau đó vào game Onmyoji → Cài đặt → Đổi quà → Nhập mã để nhận thưởng.</p>
          </div>
        </CardContent>
      </Card>

      {/* Giftcode List - Client Component */}
      <GiftcodeListClient />
    </div>
  );
}
