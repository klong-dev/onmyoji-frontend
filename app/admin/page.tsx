import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Gift, MessageSquare, TrendingUp, Crown, Activity } from "lucide-react"

const stats = [
  {
    title: "Tổng người dùng",
    value: "1,234",
    change: "+12%",
    icon: Users,
    description: "so với tháng trước",
  },
  {
    title: "Giftcode đã tạo",
    value: "56",
    change: "+8",
    icon: Gift,
    description: "trong tháng này",
  },
  {
    title: "Tin nhắn",
    value: "892",
    change: "+23%",
    icon: MessageSquare,
    description: "tin nhắn mới",
  },
  {
    title: "Quyên góp",
    value: "15,000,000đ",
    change: "+45%",
    icon: Crown,
    description: "tổng quyên góp",
  },
]

const recentActivities = [
  { user: "Seimei", action: "đã đăng ký tài khoản mới", time: "5 phút trước" },
  { user: "Kagura", action: "đã nhận giftcode ONMYOJI2024", time: "15 phút trước" },
  { user: "Ibaraki", action: "đã quyên góp 500,000đ", time: "1 giờ trước" },
  { user: "Shuten", action: "đã gửi tin nhắn mới", time: "2 giờ trước" },
  { user: "Tamamo", action: "đã cập nhật hồ sơ", time: "3 giờ trước" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Tổng quan</h1>
        <p className="text-muted-foreground">Chào mừng trở lại! Đây là tổng quan về hệ thống.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">{stat.change}</span> {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Activity className="h-5 w-5 text-primary" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <TrendingUp className="h-5 w-5 text-primary" />
              Thống kê nhanh
            </CardTitle>
            <CardDescription>Tổng quan hiệu suất hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tỷ lệ hoạt động</span>
                  <span className="font-medium text-foreground">78%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[78%] rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Giftcode đã sử dụng</span>
                  <span className="font-medium text-foreground">45%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[45%] rounded-full bg-accent" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mục tiêu quyên góp</span>
                  <span className="font-medium text-foreground">62%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[62%] rounded-full bg-green-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
