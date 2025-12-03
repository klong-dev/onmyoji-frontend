import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">陰</span>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">Onmyoji</span>
                <span className="text-lg font-bold text-primary">AutoVN</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Nền tảng cộng đồng dành cho người chơi Onmyoji. Chia sẻ kiến thức, thảo luận chiến thuật và sử dụng tool
              auto hiệu quả.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/forum" className="text-muted-foreground hover:text-primary transition-colors">
                  Diễn đàn
                </Link>
              </li>
              <li>
                <Link href="/wiki" className="text-muted-foreground hover:text-primary transition-colors">
                  Wiki
                </Link>
              </li>
              <li>
                <Link href="/releases" className="text-muted-foreground hover:text-primary transition-colors">
                  Release Notes
                </Link>
              </li>
              <li>
                <Link href="/download" className="text-muted-foreground hover:text-primary transition-colors">
                  Tải xuống
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Kết nối</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/onmyojiautovn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-all"
              >
                <span className="text-lg">🐙</span>
              </a>
              <a
                href="https://discord.gg/onmyojiautovn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-all"
              >
                <span className="text-lg">💬</span>
              </a>
              <a
                href="mailto:contact@onmyojiautovn.com"
                className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-all"
              >
                <span className="text-lg">📧</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} OnmyojiAutoVN. All rights reserved.</p>
          <p className="mt-1 text-xs">Made with passion for the Onmyoji community</p>
        </div>
      </div>
    </footer>
  )
}
