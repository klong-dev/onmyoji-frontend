import type { Metadata } from "next"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GiftcodeList } from "@/components/giftcode-list"

export const metadata: Metadata = {
  title: "Giftcode - Onmyoji AutoVN",
  description: "Tổng hợp và cập nhật giftcode Onmyoji mới nhất. Nhận ngay phần thưởng miễn phí!",
  openGraph: {
    title: "Giftcode Onmyoji - Cập nhật mới nhất",
    description: "Tổng hợp và cập nhật giftcode Onmyoji mới nhất",
  },
}

const giftcodes = [
  {
    code: "ONMYOJI2024",
    description: "Mừng năm mới 2024 - Nhận SSR ngẫu nhiên",
    rewards: ["1x SSR Selector", "500 Jade", "50 Summon Amulet"],
    expiresAt: "2024-12-31",
    status: "active" as const,
  },
  {
    code: "NEWYEAR888",
    description: "Event Tết Nguyên Đán",
    rewards: ["888 Jade", "8x Mystery Amulet", "88 AR Points"],
    expiresAt: "2024-02-29",
    status: "active" as const,
  },
  {
    code: "SEIMEI100",
    description: "Kỷ niệm 100 ngày ra mắt",
    rewards: ["100 Jade", "10x Summon Amulet"],
    expiresAt: "2024-06-30",
    status: "active" as const,
  },
  {
    code: "SSR2023",
    description: "Event cuối năm 2023",
    rewards: ["1x SSR Shard", "200 Jade"],
    expiresAt: "2023-12-31",
    status: "expired" as const,
  },
]

export default function GiftcodePage() {
  const activeCount = giftcodes.filter((g) => g.status === "active").length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
          🎁
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Giftcode Onmyoji</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Tổng hợp các mã giftcode còn hiệu lực. Nhấn để sao chép và nhận thưởng ngay!
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge variant="default" className="bg-green-500">
            {activeCount} code đang hoạt động
          </Badge>
        </div>
      </div>

      {/* Info Card */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 p-4">
          <span className="mt-0.5 text-xl text-primary">ℹ️</span>
          <div>
            <h3 className="font-medium text-foreground">Hướng dẫn sử dụng</h3>
            <p className="text-sm text-muted-foreground">
              Nhấn vào nút "Sao chép" để copy mã, sau đó vào game Onmyoji → Cài đặt → Đổi quà → Nhập mã để nhận thưởng.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Giftcode List */}
      <GiftcodeList giftcodes={giftcodes} />
    </div>
  )
}
