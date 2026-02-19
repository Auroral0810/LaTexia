'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getDailyProblem } from '@/lib/problems';
import { Sparkles, ArrowRight, BookOpen, Trophy } from 'lucide-react';

export function DailyProblemCard() {
  const { data: problem, isLoading, isError } = useQuery({
    queryKey: ['dailyProblem'],
    queryFn: getDailyProblem,
    staleTime: 1000 * 60 * 60, // 1小时缓存
  });

  if (isLoading) {
    return (
      <div className="w-full h-40 bg-card rounded-2xl border border-border/50 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-muted-foreground font-medium">挑选今日挑战...</span>
        </div>
      </div>
    );
  }

  if (isError || !problem) {
    return null; // 静默失败，不显示
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'hard': return 'text-orange-500 bg-orange-500/10';
      case 'hell': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '困难';
      case 'hell': return '地狱';
      default: return diff;
    }
  };

  return (
    <div className="group relative overflow-hidden bg-gradient-to-br from-card to-muted/30 rounded-2xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
      <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider rounded-full ring-1 ring-primary/20">
              <Sparkles className="w-3 h-3" />
              每日精选
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">• 每天更新一道精选题</span>
          </div>
          
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">
              <Link href={`/practice/${problem.id}`}>
                {problem.title}
              </Link>
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getDifficultyColor(problem.difficulty)}`}>
                {getDifficultyLabel(problem.difficulty)}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <BookOpen className="w-3 h-3" />
                {problem.categoryName || '未分类'}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Trophy className="w-3 h-3" />
                通过率: {problem.attemptCount ? `${((problem.correctCount || 0) / problem.attemptCount * 100).toFixed(1)}%` : '0.0%'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link 
            href={`/practice/${problem.id}`}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all group/btn"
          >
            立即挑战
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
