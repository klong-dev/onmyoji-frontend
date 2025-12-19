import type { Metadata } from "next"
import { DonationBar } from "@/components/donation-bar"
import { DonationLeaderboard } from "@/components/donation-leaderboard"
import { DonationMilestones } from "@/components/donation-milestones"
import { DonorTierInfo } from "@/components/donor-badge"

export const metadata: Metadata = {
  title: "Donation - Ủng hộ dự án",
  description: "Ủng hộ OnmyojiAutoVN để duy trì và phát triển tool. Xem bảng xếp hạng donors và các mốc donation.",
}

export default function DonationPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
              Ủng Hộ Dự Án
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mọi đóng góp của bạn giúp chúng tôi duy trì server, phát triển tính năng mới và hỗ trợ cộng đồng tốt hơn.
          </p>
        </div>

        {/* Main Donation Section */}
        <div className="mb-8">
          <DonationBar />
        </div>

        {/* Grid Layout for Leaderboard and Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Leaderboard */}
          <DonationLeaderboard />

          {/* Milestones */}
          <DonationMilestones />
        </div>

        {/* Donor Tier Info */}
        <div className="mb-8">
          <DonorTierInfo />
        </div>

        {/* Thank You Section */}
        <div className="rounded-2xl glass p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            ❤️ Cảm ơn sự ủng hộ của bạn!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            OnmyojiAutoVN là dự án phi lợi nhuận được phát triển và duy trì bởi cộng đồng.
            Mọi đóng góp của bạn đều được sử dụng để:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-muted/50">
              <span className="text-3xl mb-2 block">🖥️</span>
              <p className="font-semibold text-foreground">Chi phí Server</p>
              <p className="text-sm text-muted-foreground">Hosting, database, CDN</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <span className="text-3xl mb-2 block">⚡</span>
              <p className="font-semibold text-foreground">Phát triển</p>
              <p className="text-sm text-muted-foreground">Tính năng mới, cải tiến</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50">
              <span className="text-3xl mb-2 block">🎁</span>
              <p className="font-semibold text-foreground">Giftcode</p>
              <p className="text-sm text-muted-foreground">Chia sẻ cho cộng đồng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
