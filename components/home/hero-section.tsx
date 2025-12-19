"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DonationBar } from "@/components/donation-bar"
import { chatApi } from "@/lib/api"

export function HeroSection() {
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const fetchOnlineCount = async () => {
      try {
        const data = await chatApi.getOnlineCount()
        setOnlineCount(data?.total || data?.count || 0)
      } catch (err) {
        console.error("Failed to fetch online count:", err)
      }
    }

    fetchOnlineCount()
    // Refresh every 30 seconds
    const interval = setInterval(fetchOnlineCount, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Floating sakura petals */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Online badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-lg">👥</span>
            <span className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{onlineCount}</span> người đang online
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            <span className="text-foreground">Onmyoji</span>
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              {" "}
              AutoVN
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty">
            Nền tảng cộng đồng dành cho Âm Dương Sư. Tự động hóa việc cày cuốc, tập trung vào chiến thuật và thức thần
            yêu thích của bạn.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8">
              <Link href="/download">
                <span>⬇️</span>
                Tải xuống ngay
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 border-border hover:bg-muted bg-transparent">
              <Link href="/forum">
                <span>💬</span>
                Tham gia cộng đồng
              </Link>
            </Button>
          </div>

          {/* Donation bar */}
          <DonationBar />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
