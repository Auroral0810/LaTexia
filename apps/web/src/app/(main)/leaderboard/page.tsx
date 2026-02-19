'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getLeaderboard, LeaderboardEntry } from '@/lib/leaderboard';
import Image from 'next/image';
import { Trophy, Medal, Target, Zap, Clock, User, ChevronRight, Award } from 'lucide-react';

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'all_time';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<PeriodType>('all_time');

  // 计算 Period Key
  const getPeriodKey = (type: PeriodType) => {
    const now = new Date();
    if (type === 'daily') return now.toISOString().split('T')[0];
    if (type === 'monthly') return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    if (type === 'weekly') {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
    }
    return 'all';
  };

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: () => getLeaderboard(period, getPeriodKey(period)),
  });

  const getRankStyle = (rankIdx: number) => {
    switch (rankIdx) {
      case 0: return 'from-yellow-400 to-amber-600 shadow-yellow-500/20';
      case 1: return 'from-slate-300 to-slate-500 shadow-slate-400/20';
      case 2: return 'from-orange-400 to-orange-700 shadow-orange-600/20';
      default: return 'from-muted to-muted shadow-transparent';
    }
  };

  const getMedalIcon = (rankIdx: number) => {
    if (rankIdx === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rankIdx === 1) return <Medal className="w-6 h-6 text-slate-400" />;
    if (rankIdx === 2) return <Medal className="w-6 h-6 text-orange-600" />;
    return <span className="text-muted-foreground font-bold">#{rankIdx + 1}</span>;
  };

  const tabs: { value: PeriodType; label: string; icon: any }[] = [
    { value: 'daily', label: '今日', icon: Zap },
    { value: 'weekly', label: '本周', icon: Award },
    { value: 'monthly', label: '本月', icon: Clock },
    { value: 'all_time', label: '全站', icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Compact & Refined Header */}
      <div className="relative bg-card border-b border-border/40 py-8 mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl opacity-60" />
        
        <div className="container relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 ring-1 ring-primary/20">
              <Trophy className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl font-heading font-black tracking-tight text-foreground">LaTexia 荣耀榜</h1>
              <p className="text-xs text-muted-foreground font-medium max-w-md">
                见证 LaTeX 排版大师的成长之路。每一份坚持，都在这里熠熠生辉。
              </p>
            </div>
          </div>

          {/* Tab Switcher Integrated in Header Row */}
          <div className="flex p-1 bg-muted/40 rounded-xl border border-border/40 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setPeriod(tab.value)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  period === tab.value 
                    ? 'bg-card text-foreground shadow-sm ring-1 ring-border/50' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/5'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${period === tab.value ? 'text-primary' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container max-w-5xl">

        {/* Content Section */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-card rounded-2xl border border-border/40 animate-pulse" />
              ))}
            </div>
          ) : !leaderboard || leaderboard.length === 0 ? (
            <div className="bg-card rounded-3xl border border-border/40 p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <Target className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <h3 className="text-lg font-bold mb-2">暂无排名数据</h3>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                当前周期下还没有快照记录。多做几道题，明天也许你就能上榜！
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, idx) => (
                <div 
                  key={entry.userId}
                  className={`group relative flex items-center gap-4 bg-card rounded-2xl border p-4 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 ${
                    idx < 3 ? 'border-primary/10' : 'border-border/40'
                  }`}
                >
                  {/* Rank Indicator */}
                  <div className="w-12 shrink-0 flex items-center justify-center">
                    {getMedalIcon(idx)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`relative w-12 h-12 rounded-2xl overflow-hidden border-2 transition-transform group-hover:scale-110 ${
                      idx < 3 ? 'border-primary/20' : 'border-border/20'
                    }`}>
                      <Image
                        src={entry.avatarUrl || '/images/default.jpg'}
                        alt={entry.username}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold group-hover:text-primary transition-colors">{entry.username}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          已解 {entry.correctCount}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          正确率 {entry.accuracyRate ? `${parseFloat(entry.accuracyRate).toFixed(1)}%` : '0.0%'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score & Points */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full ring-1 ring-primary/10 group-hover:bg-primary/10 transition-colors">
                      <span className="text-sm font-black tracking-tight">{entry.score.toLocaleString()}</span>
                      <span className="text-[10px] font-bold uppercase opacity-60">PTS</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground opacity-40 pr-1 italic group-hover:opacity-100 transition-opacity">
                      {new Date(entry.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 更新
                    </span>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 辅助组件图标库扩展
function BookOpen({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
