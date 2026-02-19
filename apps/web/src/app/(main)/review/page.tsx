'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDueReviewProblems, getReviewStats } from '@/lib/review';
import { Trophy, Clock, BookOpen, ChevronRight, Target, Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useAuthStore } from '@/store/auth.store';

export default function ReviewPage() {
  const { user, isAuthenticated } = useAuthStore();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['review-stats', user?.id],
    queryFn: () => user ? getReviewStats(user.id) : Promise.reject('No user'),
    enabled: isAuthenticated && !!user,
  });

  const { data: dueProblems, isLoading: listLoading } = useQuery({
    queryKey: ['due-review-problems', user?.id],
    queryFn: () => user ? getDueReviewProblems(user.id) : Promise.reject('No user'),
    enabled: isAuthenticated && !!user,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold mb-4">请先登录以查看复习计划</h2>
        <Link href="/login" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold">立即登录</Link>
      </div>
    );
  }

  const isLoading = statsLoading || listLoading;


  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Section */}
      <div className="relative bg-card border-b border-border/40 py-8 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="container relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-heading font-black tracking-tight text-foreground">错题复习</h1>
              <p className="text-xs text-muted-foreground font-medium max-w-md">
                基于艾宾浩斯记忆曲线，科学规划复习时间，攻克每一个薄弱点。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl">
        {/* Stats Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">今日待复习</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-foreground">{stats?.due ?? 0}</span>
              <span className="text-xs text-muted-foreground mb-1.5 font-bold">道题目</span>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Trophy className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">已攻克</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-foreground">{stats?.completed ?? 0}</span>
              <span className="text-xs text-muted-foreground mb-1.5 font-bold">道题目</span>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-bold text-muted-foreground">总复习计划</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-foreground">{stats?.total ?? 0}</span>
              <span className="text-xs text-muted-foreground mb-1.5 font-bold">道题目</span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            待处理题目
          </h2>
          {dueProblems && dueProblems.length > 0 && (
            <Link 
              href={`/practice/${dueProblems[0].id}?mode=review`}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              立即开始复习
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* List Section */}
        <div className="space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-card rounded-2xl border border-border/40 animate-pulse" />
            ))
          ) : !dueProblems || dueProblems.length === 0 ? (
            <div className="bg-card border border-border/40 rounded-3xl p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-muted-foreground/20" />
              </div>
              <h3 className="text-md font-bold text-foreground mb-2">太棒了！目前没有待复习的题目</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed font-medium">
                休息一下，或者去练习中心挑战新题目吧。科学复习会在合适的时间提醒您的。
              </p>
              <Link 
                href="/practice"
                className="mt-6 px-6 py-2.5 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold transition-colors"
              >
                前往练习中心
              </Link>
            </div>
          ) : (
            dueProblems.map((problem) => (
              <Link 
                key={problem.id}
                href={`/practice/${problem.id}?mode=review`}
                className="group relative flex items-center gap-4 bg-card rounded-2xl border border-border/40 p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-10 shrink-0 flex flex-col items-center">
                  <div className="text-[10px] font-black text-muted-foreground uppercase mb-1">Stage</div>
                  <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-black text-sm border border-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                    {problem.stage}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors mb-1">
                    {problem.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase transition-colors ${
                      problem.difficulty === 'easy' ? 'bg-green-500/10 text-green-600' :
                      problem.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600' :
                      'bg-red-500/10 text-red-600'
                    }`}>
                      {problem.difficulty}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      建议复习: {new Date(problem.nextReviewAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
