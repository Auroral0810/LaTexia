'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Check, Copy, ChevronRight, List } from 'lucide-react';
import { Button } from '@latexia/ui/components/ui/button';
import { toast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import 'katex/dist/katex.min.css';

// 侧边栏小节信息
interface SidebarSection {
  title: string;
  slug: string;
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
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
  const [activeId, setActiveId] = useState<string>('');

  // 1. 提取目录 (## 和 ###)
  const toc: TOCItem[] = useMemo(() => {
    const lines = sectionContent.split('\n');
    const items: TOCItem[] = [];
    
    lines.forEach(line => {
      const match = line.match(/^(#{2,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        // 生成简单的 ID
        const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
        items.push({ id, text, level });
      }
    });
    
    return items;
  }, [sectionContent]);

  // 2. 监听滚动以更新激活的目录项
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [toc]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast.success('代码已复制到剪贴板');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="container py-8 flex gap-8 relative items-start">
      {/* 左侧边栏：章节目录 */}
      <div className="hidden lg:block w-72 shrink-0 space-y-6">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-6 px-3">
            <Link href="/learn" className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="font-bold text-sm text-foreground uppercase tracking-widest truncate" title={chapterTitle}>
              {chapterTitle}
            </div>
          </div>

          <div className="space-y-1.5 max-h-[calc(100vh-12rem)] overflow-y-auto pr-3 custom-scrollbar">
            {sections.map((sec, idx) => {
              const isActive = idx === sectionIndex;
              return (
                <Link
                  key={sec.slug}
                  href={`/learn/${chapterSlug}/${sec.slug}`}
                  className={cn(
                    "block px-4 py-2.5 text-sm rounded-xl transition-all border border-transparent",
                    isActive
                      ? 'bg-primary/10 text-primary border-primary/20 shadow-sm font-semibold'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn(
                      "text-[10px] mt-1 shrink-0 w-4 h-4 flex items-center justify-center rounded-full border transition-colors",
                      isActive ? "bg-primary text-white border-primary" : "border-muted-foreground/30 text-muted-foreground/50"
                    )}>
                      {idx + 1}
                    </span>
                    <span className="leading-tight">{sec.title}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 min-w-0 max-w-4xl">
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-3xl p-6 lg:p-10 shadow-sm transition-all hover:shadow-md">
          {/* 面包屑 + 标题 */}
          <div className="mb-10 border-b border-border/30 pb-8">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
              <Link href="/learn" className="hover:text-primary transition-colors">教学</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href={`/learn/${chapterSlug}`} className="hover:text-primary transition-colors">{chapterTitle}</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary/70">第 {sectionNumber} 节</span>
            </div>
            <h1 className="text-4xl font-heading font-extrabold mb-4 tracking-tight leading-tight">{sectionTitle}</h1>
          </div>

          {/* Markdown 渲染区 */}
          <div className="prose prose-slate dark:prose-invert max-w-none mb-16
            prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border/50
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-8 prose-p:my-5 prose-p:text-muted-foreground/90
            prose-li:leading-8 prose-li:my-1
            prose-blockquote:border-l-4 prose-blockquote:border-primary/40 prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
            prose-table:border-collapse prose-table:my-8
            prose-th:bg-muted/30 prose-th:px-5 prose-th:py-3 prose-th:border prose-th:border-border/50 prose-th:font-semibold
            prose-td:px-5 prose-td:py-3 prose-td:border prose-td:border-border/50
            prose-hr:border-border/20 prose-hr:my-12
            prose-strong:text-foreground prose-strong:font-bold
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[
                [rehypeKatex, { throwOnError: false, strict: false, output: 'htmlAndMathml' }],
                rehypeRaw
              ]}
              components={{
                // 处理标题以添加 ID
                h2: ({ node, children, ...props }: any) => {
                  const id = String(children[0]).toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
                  return <h2 id={id} {...props}>{children}</h2>;
                },
                h3: ({ node, children, ...props }: any) => {
                  const id = String(children[0]).toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
                  return <h3 id={id} {...props}>{children}</h3>;
                },
                // 自定义链接：新标签页打开
                a: ({ node, ...props }: any) => (
                  <a {...props} className="text-primary hover:underline decoration-primary/30 underline-offset-4" target="_blank" rel="noopener noreferrer" />
                ),
                // 自定义代码块渲染
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isBlock = !!match;

                  if (!isBlock) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-foreground border border-border/50" {...props}>
                        {children}
                      </code>
                    );
                  }

                  const codeString = String(children).replace(/\n$/, '');
                  const lang = match[1];

                  return (
                    <div className="my-8 rounded-2xl overflow-hidden border border-border/50 bg-zinc-950/90 shadow-2xl relative group not-prose">
                      <div className="flex items-center justify-between px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/50">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1.5 mr-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                            {lang === 'latex' ? 'LaTeX Source' : lang}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                          onClick={() => handleCopy(codeString)}
                        >
                          {copiedText === codeString
                            ? <Check className="h-4 w-4 text-emerald-400" />
                            : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-zinc-100 selection:bg-primary/30">
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
          <div className="mt-12 pt-12 border-t border-border/30 flex justify-between gap-6">
            {prevNavUrl ? (
              <Link
                href={prevNavUrl}
                className="group flex-1 flex flex-col gap-2 text-left p-6 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/50"
              >
                <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-[0.2em] font-bold">
                  {prevNavLabel}
                </span>
                <span className="font-bold text-lg flex items-center gap-2 group-hover:text-primary transition-all group-hover:-translate-x-1 duration-300">
                  ← {prevSectionTitle || '上一节'}
                </span>
              </Link>
            ) : (
              <div className="flex-1 invisible" />
            )}

            {nextUrl ? (
              <Link
                href={nextUrl}
                className="group flex-1 flex flex-col gap-2 text-right p-6 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/50"
              >
                <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors uppercase tracking-[0.2em] font-bold">
                  {nextLabel}
                </span>
                <span className="font-bold text-lg flex items-center gap-2 group-hover:text-primary justify-end transition-all group-hover:translate-x-1 duration-300">
                  {nextSectionTitle || '下一节'} →
                </span>
              </Link>
            ) : (
              <div className="flex-1 invisible" />
            )}
          </div>
        </div>
      </div>

      {/* 右侧边栏：本节目录 (TOC) */}
      <div className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-24">
          <div className="flex items-center gap-2 mb-6 px-4 py-2 border-b border-border/30">
            <List className="w-4 h-4 text-primary/70" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-foreground/70">本节目录</span>
          </div>
          
          <div className="space-y-0.5 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 custom-scrollbar">
            {toc.length > 0 ? (
              toc.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  className={cn(
                    "w-full text-left px-4 py-2 text-xs transition-all border-l-2 relative",
                    item.level === 3 ? "pl-8" : "",
                    activeId === item.id 
                      ? "text-primary border-primary bg-primary/5 font-bold" 
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted hover:bg-muted/20"
                  )}
                >
                  {item.text}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center border-2 border-dashed border-border/50 rounded-2xl">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-relaxed">
                  暂无子目录
                </p>
              </div>
            )}
          </div>
          
          {/* 进度提示或其他小工具 */}
          <div className="mt-12 p-6 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
            <h4 className="text-xs font-bold mb-2">学习建议</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              阅读完本节后，建议去“练习”模块进行相关公式的临摹，巩固记忆。
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .container {
          max-width: 1600px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary), 0.2);
        }
      `}</style>
    </div>
  );
}
