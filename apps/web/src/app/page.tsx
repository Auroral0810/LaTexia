import Link from 'next/link';
import { Header } from '@/components/layout/Header';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              Latexia
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              面向学生、学术研究者和技术写作者的企业级 LaTeX 训练平台。
              <br />
              从基础语法到复杂排版，助你精通学术写作。
            </p>
            <div className="space-x-4">
              <Link href="/auth/register" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
                开始练习
              </Link>
              <Link href="/learn" className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                浏览教程
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
