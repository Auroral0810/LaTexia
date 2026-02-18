import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                L
              </div>
              <span className="font-heading font-bold text-lg">Latexia</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              面向学生、学术研究者和技术写作者的在线 LaTeX 学习与练习平台。
            </p>
            <p className="text-xs text-muted-foreground">
              Version 1.0.0
            </p>
          </div>

          {/* 产品 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">产品</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/practice" className="text-sm text-muted-foreground hover:text-foreground transition-colors">题库练习</Link>
              <Link href="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">系统教程</Link>
              <Link href="/symbols" className="text-sm text-muted-foreground hover:text-foreground transition-colors">符号查询</Link>
              <Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">排行榜</Link>
            </nav>
          </div>

          {/* 支持 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">支持</h4>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">关于我们</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">隐私政策</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">服务条款</Link>
              <a href="https://github.com/Auroral0810/LaTexia" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                GitHub
              </a>
            </nav>
          </div>

          {/* 联系 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">联系方式</h4>
            <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
              <a href="mailto:15968588744@163.com" className="hover:text-foreground transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                15968588744@163.com
              </a>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                QQ: 1957689514
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                微信: Luckff0810
              </span>
              <a href="https://fishblog.yyf040810.cn" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
                个人博客
              </a>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Latexia. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">隐私政策</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">服务条款</Link>
            <a href="https://github.com/Auroral0810/LaTexia" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
