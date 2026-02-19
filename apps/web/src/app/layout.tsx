
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
  description: '面向学生与研究者的 LaTeX 在线刷题平台，通过系统化的题库练习与即时反馈，帮你真正掌握 LaTeX',
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
