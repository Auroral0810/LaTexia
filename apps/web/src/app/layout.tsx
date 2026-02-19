
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import QueryProvider from '@/components/providers/query-provider';
import '@/styles/globals.css';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: {
    default: 'Latexia — 在线 LaTeX 学习与练习平台',
    template: '%s | Latexia',
  },
  description: '面向学生、学术研究者和技术写作者的企业级 SaaS 风格 LaTeX 训练平台',
  keywords: ['LaTeX', '学习', '练习', '公式', '数学', '排版'],
  icons: {
    icon: '/images/logo1.png',
  },
};

/**
 * 根 Layout —— 主题 Provider、Query Provider、国际化 Provider
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <ToastContainer />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
