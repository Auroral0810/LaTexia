import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LatexScratchpad } from '@/components/common/LatexScratchpad';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {/* 全局悬浮 LaTeX 草稿本 */}
      <LatexScratchpad />
    </div>
  );
}
