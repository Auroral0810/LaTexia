'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getChapterTree } from '@/lib/learn';
import { Skeleton } from '@latexia/ui';

export default function LearnPage() {
  const { data: chapters, isLoading } = useQuery({
    queryKey: ['learn-tree'],
    queryFn: getChapterTree,
  });

  if (isLoading) {
    return (
      <div className="container py-8 animate-slide-up">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">系统教程</h1>
        <p className="mt-2 text-muted-foreground">从入门到精通，循序渐进掌握 LaTeX</p>
      </div>

      <div className="space-y-4">
        {chapters?.map((ch, i) => (
          <Link
            key={ch.id}
            href={`/learn/${ch.slug}`}
            className="group flex items-center gap-6 rounded-xl border border-border/50 bg-card p-5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          >
            {/* 章节号 */}
            <div className="hidden sm:flex shrink-0 w-12 h-12 rounded-xl bg-primary/10 text-primary items-center justify-center font-heading font-bold text-lg">
              {i + 1}
            </div>
            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold group-hover:text-primary transition-colors">{ch.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{ch.sections.length} 个小节 · 持续更新中</p>
            </div>
            {/* 箭头 */}
            <svg className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

