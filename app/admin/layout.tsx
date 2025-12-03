import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import Link from "next/link"
import { LayoutDashboard, Users, Gift, MessageSquare, Settings, LogOut, Crown, Scroll } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard - Onmyoji Fan Hub",
  description: "Quản lý hệ thống Onmyoji Fan Hub",
  robots: "noindex, nofollow",
}

const adminNavItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Tổng quan" },
  { href: "/admin/users", icon: Users, label: "Người dùng" },
  { href: "/admin/giftcodes", icon: Gift, label: "Giftcode" },
  { href: "/admin/donations", icon: Crown, label: "Quyên góp" },
  { href: "/admin/messages", icon: MessageSquare, label: "Tin nhắn" },
  { href: "/admin/settings", icon: Settings, label: "Cài đặt" },
]

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin authentication
  const cookieStore = await cookies()
  const token = cookieStore.get("token")

  if (!token) {
    redirect("/login?redirect=/admin")
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <Scroll className="h-6 w-6 text-primary" />
            <span className="font-serif text-lg font-bold text-foreground">Admin Panel</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-3">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Về trang chủ</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </div>
  )
}
