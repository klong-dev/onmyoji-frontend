import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Releases - Onmyoji AutoVN",
  description: "Theo dõi các bản cập nhật và tính năng mới của Onmyoji AutoVN.",
}

const releases = [
  {
    version: "v2.0.0",
    name: "Đại cập nhật giao diện",
    date: "2024-01-15",
    type: "major",
    changes: [
      "Thiết kế lại toàn bộ giao diện với theme Onmyoji",
      "Tối ưu hiệu năng và trải nghiệm người dùng",
      "Thêm chế độ tối/sáng",
      "Cải thiện responsive trên mobile",
    ],
  },
  {
    version: "v1.5.0",
    name: "Tính năng Wiki",
    date: "2024-01-10",
    type: "minor",
    changes: ["Thêm trang Wiki với thông tin thức thần", "Hệ thống tìm kiếm wiki", "Tính năng đóng góp bài viết"],
  },
  {
    version: "v1.4.2",
    name: "Sửa lỗi Chat",
    date: "2024-01-05",
    type: "patch",
    changes: ["Sửa lỗi không gửi được tin nhắn", "Cải thiện hiệu năng realtime"],
  },
  {
    version: "v1.4.0",
    name: "Hệ thống Giftcode",
    date: "2024-01-01",
    type: "minor",
    changes: ["Thêm trang tổng hợp giftcode", "Tính năng sao chép nhanh", "Thông báo khi có code mới"],
  },
]

const typeConfig = {
  major: { label: "Major", color: "bg-red-500" },
  minor: { label: "Minor", color: "bg-blue-500" },
  patch: { label: "Patch", color: "bg-green-500" },
}

export default function ReleasesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
          🚀
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">Lịch sử cập nhật</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Theo dõi các phiên bản và tính năng mới của Onmyoji AutoVN
        </p>
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-3xl">
        <div className="relative space-y-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-border md:before:left-1/2 md:before:-translate-x-1/2">
          {releases.map((release, index) => (
            <div
              key={release.version}
              className={`relative flex flex-col gap-4 pl-12 md:flex-row md:gap-8 md:pl-0 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Dot */}
              <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-primary text-xs md:left-1/2 md:-translate-x-1/2">
                🔀
              </div>

              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                <Card className="border-border bg-card">
                  <CardHeader>
                    <div className={`flex items-center gap-2 ${index % 2 === 0 ? "md:justify-end" : ""}`}>
                      <Badge className={typeConfig[release.type as keyof typeof typeConfig].color}>
                        {release.version}
                      </Badge>
                      <Badge variant="outline">{typeConfig[release.type as keyof typeof typeConfig].label}</Badge>
                    </div>
                    <CardTitle className="font-serif">{release.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      📅 {new Date(release.date).toLocaleDateString("vi-VN")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className={`space-y-2 ${index % 2 === 0 ? "md:text-right" : ""}`}>
                      {release.changes.map((change, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {change}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden flex-1 md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
