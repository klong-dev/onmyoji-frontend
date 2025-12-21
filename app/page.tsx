import type { Metadata } from "next"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { CommunitySection } from "@/components/home/community-section"
import { OrganizationJsonLd, WebSiteJsonLd, SoftwareApplicationJsonLd, FAQJsonLd } from "@/components/seo/json-ld"

export const metadata: Metadata = {
  title: "OnmyojiAutoVN - Tool Auto Onmyoji Miễn Phí #1 Việt Nam",
  description: "Tải tool auto Onmyoji miễn phí. Farm tự động Orochi, Soul, Kirin. Wiki thức thần, ngự hồn tiếng Việt đầy đủ. An toàn, cập nhật liên tục.",
  keywords: [
    "Onmyoji auto", "tool Onmyoji", "Âm Dương Sư auto", "auto farm Onmyoji",
    "tải Onmyoji auto", "download tool Onmyoji", "farm Orochi auto"
  ],
  alternates: {
    canonical: "/",
  },
}

const faqItems = [
  { question: "OnmyojiAutoVN có an toàn không?", answer: "Có, phần mềm mã nguồn mở, không thu thập dữ liệu cá nhân." },
  { question: "Tool có bị ban không?", answer: "Rủi ro ban luôn tồn tại khi sử dụng tool. Khuyến nghị sử dụng hợp lý." },
  { question: "Hỗ trợ những giả lập nào?", answer: "LDPlayer, BlueStacks 5, MuMu Player, NoxPlayer và điện thoại Android." },
]

export default function HomePage() {
  return (
    <>
      <OrganizationJsonLd />
      <WebSiteJsonLd />
      <SoftwareApplicationJsonLd />
      <FAQJsonLd items={faqItems} />
      <div className="flex flex-col">
        <HeroSection />
        <FeaturesSection />
        <CommunitySection />
      </div>
    </>
  )
}
