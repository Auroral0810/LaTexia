import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LatexScratchpad } from '@/components/common/LatexScratchpad';
import { MusicPlayer } from '@/components/common/MusicPlayer';

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
      {/* 全局悬浮音乐播放器 */}
      <MusicPlayer />
    </div>
  );
}
