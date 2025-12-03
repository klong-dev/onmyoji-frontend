import type { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { CommunitySection } from "@/components/home/community-section"

export const metadata: Metadata = {
  title: "OnmyojiAutoVN - Cộng đồng Auto Script Onmyoji",
  description:
    "Nền tảng cộng đồng dành cho người chơi Onmyoji sử dụng auto script. Tải tool, hướng dẫn, diễn đàn thảo luận và wiki.",
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
    </div>
  )
}
