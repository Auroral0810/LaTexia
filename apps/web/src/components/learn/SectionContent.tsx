'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Copy } from 'lucide-react';
import { Button } from '@latexia/ui/components/ui/button';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

// 侧边栏小节信息
interface SidebarSection {
  title: string;
  slug: string;
}

interface SectionContentProps {
  // 章节信息
  chapterTitle: string;
  chapterSlug: string;
  sections: SidebarSection[];
  // 当前小节
  sectionTitle: string;
  sectionContent: string;
  sectionIndex: number;    // 0-indexed
  sectionNumber: number;   // 1-indexed
  // 导航
  prevNavUrl: string | null;
  prevNavLabel: string | null;
  nextUrl: string | null;
  nextLabel: string | null;
  prevSectionTitle?: string;
  nextSectionTitle?: string;
}

export default function SectionContent({
  chapterTitle,
  chapterSlug,
  sections,
  sectionTitle,
  sectionContent,
  sectionIndex,
  sectionNumber,
  prevNavUrl,
  prevNavLabel,
  nextUrl,
  nextLabel,
  prevSectionTitle,
  nextSectionTitle,
}: SectionContentProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success('代码已复制到剪贴板');
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="container py-8 flex gap-8">
      {/* 左侧边栏：章节目录 */}
      <div className="hidden lg:block w-64 shrink-0 space-y-6">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/learn" className="text-muted-foreground hover:text-primary transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="font-bold text-sm text-foreground uppercase tracking-wider truncate" title={chapterTitle}>
              {chapterTitle}
            </div>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
            {sections.map((sec, idx) => {
              const isActive = idx === sectionIndex;
              return (
                <Link
                  key={sec.slug}
                  href={`/learn/${chapterSlug}/${sec.slug}`}
                  className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`text-xs font-mono mt-0.5 ${isActive ? 'opacity-80' : 'opacity-50'}`}>{idx + 1}.</span>
                    <span>{sec.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 min-w-0 max-w-3xl">
        {/* 面包屑 + 标题 */}
        <div className="mb-8 border-b border-border/50 pb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/learn" className="hover:text-primary transition-colors">教学</Link>
            <span>/</span>
            <Link href={`/learn/${chapterSlug}`} className="hover:text-primary transition-colors">{chapterTitle}</Link>
            <span>/</span>
            <span className="text-primary font-medium">第 {sectionNumber} 节</span>
          </div>
          <h1 className="text-3xl font-heading font-bold mb-4">{sectionTitle}</h1>
        </div>

        {/* Markdown 渲染区 */}
        <div className="prose prose-slate dark:prose-invert max-w-none mb-16
          prose-headings:font-heading prose-headings:font-bold
          prose-h1:text-2xl prose-h1:mt-8 prose-h1:mb-4
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border/30
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
          prose-p:leading-7 prose-p:my-4
          prose-li:leading-7
          prose-blockquote:border-l-primary/50 prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
          prose-table:border-collapse
          prose-th:bg-muted/50 prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-border
          prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-border
          prose-hr:border-border/30 prose-hr:my-8
          prose-strong:text-foreground
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[
              [rehypeKatex, { throwOnError: false, strict: false, output: 'htmlAndMathml' }],
              rehypeRaw
            ]}
            components={{
              // 自定义链接：新标签页打开
              a: ({ node, ...props }: any) => (
                <a {...props} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" />
              ),
              // 自定义代码块渲染
              code: ({ node, className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || '');
                const isBlock = !!match;

                if (!isBlock) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
                      {children}
                    </code>
                  );
                }

                const codeString = String(children).replace(/\n$/, '');
                const lang = match[1];

                return (
                  <div className="my-6 rounded-xl overflow-hidden border border-border bg-zinc-950 shadow-lg relative group not-prose">
                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
                      <span className="text-xs font-mono text-zinc-400">
                        {lang === 'latex' ? 'LaTeX' : lang}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-zinc-400 hover:text-white"
                        onClick={() => handleCopy(codeString)}
                      >
                        {copiedText === codeString
                          ? <Check className="h-3.5 w-3.5 text-green-500" />
                          : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                    <pre className="p-5 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-100">
                      <code className={className} {...props}>{children}</code>
                    </pre>
                  </div>
                );
              },
            }}
          >
            {sectionContent}
          </ReactMarkdown>
        </div>

        {/* 底部导航 */}
        <div className="mt-8 pt-8 border-t border-border flex justify-between">
          {prevNavUrl ? (
            <Link
              href={prevNavUrl}
              className="group flex flex-col gap-2 text-left p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                {prevNavLabel}
              </span>
              <span className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                ← {prevSectionTitle || '上一节'}
              </span>
            </Link>
          ) : (
            <div className="w-1" />
          )}

          {nextUrl ? (
            <Link
              href={nextUrl}
              className="group flex flex-col gap-2 text-right p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
            >
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors uppercase tracking-wider">
                {nextLabel}
              </span>
              <span className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                {nextSectionTitle || '下一节'} →
              </span>
            </Link>
          ) : (
            <div className="w-1" />
          )}
        </div>
      </div>
    </div>
  );
}
