import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
          </div>

          <div className="container py-24 sm:py-32 lg:py-40">
            <div className="mx-auto max-w-3xl text-center animate-slide-up">
              {/* 徽章 */}
              <div className="mb-6 inline-flex items-center rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm">
                <span className="mr-2 inline-block w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-muted-foreground">v1.0 — 开源 LaTeX 学习平台</span>
              </div>

              {/* 标题 */}
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                掌握{' '}
                <span className="text-gradient bg-gradient-to-r from-primary via-teal-400 to-emerald-500">
                  LaTeX
                </span>
                <br />
                从这里开始
              </h1>

              {/* 描述 */}
              <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
                面向学生、学术研究者和技术写作者的在线训练平台。
                从基础语法到复杂排版，交互式练习助你精通学术写作。
              </p>

              {/* CTA */}
              <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                >
                  免费开始练习
                </Link>
                <Link
                  href="/learn"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-sm font-semibold shadow-sm hover:bg-accent transition-all hover:-translate-y-0.5"
                >
                  <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  浏览教程
                </Link>
              </div>

              {/* LaTeX 代码装饰 */}
              <div className="mt-16 font-mono text-xs text-muted-foreground/30 tracking-wider">
                {'\\begin{document} \\maketitle \\end{document}'}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border/40 bg-muted/20">
          <div className="container py-24">
            <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                为什么选择 Latexia
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                专为 LaTeX 学习者设计的完整练习体系
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '📝',
                  title: '交互式练习',
                  desc: '实时编辑器 + 即时预览，所见即所得的练习体验',
                },
                {
                  icon: '📚',
                  title: '体系化教程',
                  desc: '从入门到精通的完整知识树，循序渐进掌握 LaTeX',
                },
                {
                  icon: '🔍',
                  title: '符号速查',
                  desc: '数千个 LaTeX 符号的分类索引，手写识别即查即用',
                },
                {
                  icon: '🏆',
                  title: '竞技排名',
                  desc: '限时挑战赛 + 全球排行榜，在竞争中成长',
                },
                {
                  icon: '📊',
                  title: '学习数据',
                  desc: '个人进度仪表盘，追踪你的练习轨迹和薄弱环节',
                },
                {
                  icon: '🌐',
                  title: '开源免费',
                  desc: '完全开源，社区驱动，永久免费使用所有核心功能',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40">
          <div className="container py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                准备好了吗？
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                加入 Latexia，开启你的 LaTeX 学习之旅
              </p>
              <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                >
                  立即注册
                </Link>
                <a
                  href="https://github.com/Auroral0810/LaTexia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-background px-8 text-sm font-semibold shadow-sm hover:bg-accent transition-all hover:-translate-y-0.5"
                >
                  <svg className="mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  Star on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
