const features = [
  {
    icon: "🤖",
    title: "Auto Farm",
    description: "Tự động cày nguyên liệu, kinh nghiệm và vật phẩm 24/7 mà không cần giám sát.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "⚔️",
    title: "Auto Battle",
    description: "Chiến đấu tự động với AI thông minh, hỗ trợ mọi loại dungeon và boss.",
    gradient: "from-red-500 to-orange-500",
  },
  {
    icon: "🧠",
    title: "Smart AI",
    description: "Thuật toán AI tiên tiến giúp tối ưu chiến thuật và đội hình shikigami.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: "🔄",
    title: "Auto Daily",
    description: "Hoàn thành tự động nhiệm vụ hàng ngày, sự kiện và phần thưởng.",
    gradient: "from-green-500 to-emerald-500",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-card/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tính năng <span className="text-primary">nổi bật</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Công cụ mạnh mẽ giúp bạn tận hưởng Onmyoji một cách tối ưu nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl glass glass-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform flex items-center justify-center`}
              >
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
