import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: '关于',
  description: '了解 Latexia 项目、团队和联系方式',
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border/40">
          <div className="container py-16 sm:py-24">
            <div className="mx-auto max-w-3xl text-center animate-slide-up">
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
                关于 Latexia
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                Latexia 是一个开源的在线 LaTeX 学习与练习平台，
                致力于让 LaTeX 学习像刷题一样简单而有趣。
              </p>
            </div>
          </div>
        </section>

        {/* 项目介绍 */}
        <section className="border-b border-border/40">
          <div className="container py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-2xl font-bold mb-6">🎯 我们的愿景</h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 text-muted-foreground">
                <p>
                  LaTeX 是学术界最强大的排版工具，但其陡峭的学习曲线让许多初学者望而却步。
                  Latexia 旨在通过交互式的练习和体系化的教程，让每一位学生和研究者都能轻松掌握 LaTeX。
                </p>
                <p>
                  我们相信，好的工具应该是免费和开源的。Latexia 完全开源，由社区驱动，
                  欢迎任何人参与贡献。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 技术栈 */}
        <section className="border-b border-border/40 bg-muted/20">
          <div className="container py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-2xl font-bold mb-8">🛠 技术栈</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Next.js 14', desc: '前端框架' },
                  { name: 'Hono', desc: '后端 API' },
                  { name: 'PostgreSQL', desc: '数据库' },
                  { name: 'Drizzle ORM', desc: '数据层' },
                  { name: 'TailwindCSS', desc: '样式系统' },
                  { name: 'Turborepo', desc: '构建工具' },
                  { name: 'Zustand', desc: '状态管理' },
                  { name: 'KaTeX', desc: '公式渲染' },
                  { name: 'TypeScript', desc: '类型安全' },
                ].map((tech) => (
                  <div key={tech.name} className="rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 transition-colors">
                    <div className="font-semibold text-sm">{tech.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{tech.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="border-b border-border/40">
          <div className="container py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-2xl font-bold mb-8">📬 联系我们</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* 基本信息 */}
                <div className="space-y-4">
                  <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3">
                    <h3 className="font-semibold">开发者</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <a href="mailto:15968588744@163.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">📧</span>
                        15968588744@163.com
                      </a>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">💬</span>
                        QQ：1957689514
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">💚</span>
                        微信：Luckff0810
                      </div>
                      <a href="https://fishblog.yyf040810.cn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">🌐</span>
                        个人博客
                      </a>
                      <a href="https://github.com/Auroral0810/LaTexia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground">🐙</span>
                        GitHub 仓库
                      </a>
                    </div>
                  </div>
                </div>

                {/* 二维码 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                      <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden bg-white">
                        <Image src="/images/QQ二维码.jpg" alt="QQ 二维码" fill className="object-contain p-2" />
                      </div>
                      <p className="text-xs text-muted-foreground">QQ</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-card p-4 text-center">
                      <div className="relative w-full aspect-square mb-2 rounded-lg overflow-hidden bg-white">
                        <Image src="/images/wechat二维码.jpg" alt="微信二维码" fill className="object-contain p-2" />
                      </div>
                      <p className="text-xs text-muted-foreground">微信</p>
                    </div>
                    <div className="rounded-xl border border-border/50 bg-card p-4 text-center col-span-2">
                      <div className="relative w-full aspect-[2/1] mb-2 rounded-lg overflow-hidden bg-white">
                        <Image src="/images/CSDN二维码.png" alt="CSDN 二维码" fill className="object-contain p-2" />
                      </div>
                      <p className="text-xs text-muted-foreground">CSDN 博客</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 贡献 CTA */}
        <section>
          <div className="container py-16">
            <div className="mx-auto max-w-xl text-center">
              <h2 className="font-heading text-2xl font-bold mb-4">🤝 参与贡献</h2>
              <p className="text-muted-foreground mb-6">
                Latexia 是一个开源项目，我们欢迎任何形式的贡献！
              </p>
              <a
                href="https://github.com/Auroral0810/LaTexia"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
              >
                <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                查看 GitHub 仓库
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
