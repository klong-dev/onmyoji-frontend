"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GiftcodeList } from "@/components/giftcode-list";
import { giftcodeApi, type Giftcode } from "@/lib/api";

export function GiftcodeListClient() {
  const [giftcodes, setGiftcodes] = useState<Giftcode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCount, setActiveCount] = useState(0);

  const fetchGiftcodes = async () => {
    try {
      setIsLoading(true);
      const data = await giftcodeApi.getAll();
      const codes = data?.giftcodes || [];
      setGiftcodes(codes);
      setActiveCount(codes.filter((g) => g.status === "active").length);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách giftcode");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGiftcodes();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-muted-foreground">Đang tải danh sách giftcode...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">❌</span>
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchGiftcodes} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  if ((giftcodes?.length || 0) === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <span className="text-4xl">📭</span>
        <p className="text-muted-foreground">Hiện chưa có giftcode nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Badge variant="default" className="bg-green-500">
          {activeCount} code đang hoạt động
        </Badge>
      </div>
      <GiftcodeList giftcodes={giftcodes} />
    </div>
  );
}
