'use client';

import React from 'react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Lock, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getProblems, getProblemMetadata, ProblemDifficulty, ProblemStatus } from '@/lib/problems';
import { useState } from 'react';

export default function PracticePage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // 状态管理
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<ProblemDifficulty | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  // 获取元数据 (分类和标签)
  const { data: metadata } = useQuery({
    queryKey: ['problemMetadata'],
    queryFn: getProblemMetadata,
  });

  // 获取题目列表
  const { data: problemsData, isLoading } = useQuery({
    queryKey: ['problems', { categoryId, difficulty, status, search, page, pageSize }],
    queryFn: () => getProblems({
      categoryId,
      difficulty,
      search: search || undefined,
      page,
      pageSize,
    }),
  });

  const difficulties: { value: ProblemDifficulty; label: string }[] = [
    { value: 'easy', label: '简单' },
    { value: 'medium', label: '中等' },
    { value: 'hard', label: '困难' },
    { value: 'hell', label: '地狱' },
  ];

  const statusMap: Record<string, string> = {
    unstarted: '未开始',
    solved: '已解决',
    attempted: '尝试过',
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/10 text-green-600';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      case 'hard': return 'bg-orange-500/10 text-orange-600';
      case 'hell': return 'bg-red-500/10 text-red-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    return difficulties.find(d => d.value === diff)?.label || diff;
  };

  const handleSidebarClick = () => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  };

  const SidebarOverlay = () => (
    <div 
      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/40 backdrop-blur-[6px] rounded-2xl cursor-pointer group transition-all hover:bg-background/50"
      onClick={handleSidebarClick}
    >
      <div className="bg-card/80 p-3 rounded-full shadow-lg border border-border/50 group-hover:scale-110 transition-transform mb-3">
        <Lock className="w-5 h-5 text-primary" />
      </div>
      <p className="text-sm font-bold text-foreground">请登录后查看</p>
      <p className="text-[10px] text-muted-foreground mt-1">点击前往登录页</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 flex gap-8">
        {/* Main Content: Problem List */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Header & Filters */}
          <div className="flex flex-col gap-4 p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-heading font-bold">题库</h1>
              <div className="text-sm text-muted-foreground">
                共 <span className="font-bold text-foreground">{problemsData?.total || 0}</span> 道题目
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setCategoryId(undefined); setPage(1); }}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  categoryId === undefined 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                全部
              </button>
              {metadata?.categories.filter(c => !c.parentId).map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => { setCategoryId(cat.id); setPage(1); }}
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    categoryId === cat.id 
                      ? 'bg-primary text-primary-foreground font-medium' 
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4 pt-2">
               <div className="relative flex-1 max-w-sm">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                   placeholder="搜索题目名称..." 
                   className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                 />
               </div>
               <Select value={difficulty || 'all'} onValueChange={(v) => { setDifficulty(v === 'all' ? undefined : v as ProblemDifficulty); setPage(1); }}>
                 <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="难度" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">全部难度</SelectItem>
                   {difficulties.map(d => (
                     <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
               
               <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? undefined : v); setPage(1); }}>
                 <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="状态" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">全部状态</SelectItem>
                   <SelectItem value="unstarted">未开始</SelectItem>
                   <SelectItem value="solved">已解决</SelectItem>
                   <SelectItem value="attempted">尝试过</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          {/* Problem Table */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium w-16">状态</th>
                    <th className="px-6 py-4 font-medium">题目</th>
                    <th className="px-6 py-4 font-medium w-32">通过率</th>
                    <th className="px-6 py-4 font-medium w-24">难度</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          正在加载题目...
                        </div>
                      </td>
                    </tr>
                  ) : problemsData?.items.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                        暂无符合条件的题目
                      </td>
                    </tr>
                  ) : (
                    problemsData?.items.map((problem, index) => (
                      <tr key={problem.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          {isAuthenticated ? (
                            <>
                              {problem.status === 'solved' && <span className="text-green-500 font-bold">✓</span>}
                              {problem.status === 'attempted' && <span className="text-yellow-500 font-bold">?</span>}
                              {problem.status === 'unstarted' && <span className="text-muted-foreground/20"></span>}
                            </>
                          ) : (
                            <span className="text-muted-foreground/30">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Link href={`/practice/${problem.id}`} className="font-medium hover:text-primary transition-colors block">
                            {(page - 1) * pageSize + index + 1}. {problem.title}
                          </Link>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                              {problem.categoryName || '未分类'}
                            </span>
                            {problem.tags.map(t => (
                              <span 
                                key={t.id} 
                                className="text-[10px] px-1.5 py-0.5 rounded"
                                style={{ backgroundColor: `${t.color}20`, color: t.color || 'var(--muted-foreground)' }}
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {problem.attemptCount ? `${((problem.correctCount || 0) / problem.attemptCount * 100).toFixed(1)}%` : '0.0%'}
                          <span className="text-[10px] ml-1 opacity-50">({problem.attemptCount || 0} 次尝试)</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                            {getDifficultyLabel(problem.difficulty)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Real Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-card">
              <span className="text-muted-foreground text-[10px]">
                显示 {Math.min((page - 1) * pageSize + 1, problemsData?.total || 0)} - {Math.min(page * pageSize, problemsData?.total || 0)} 共 {problemsData?.total || 0} 条
              </span>
              <div className="flex gap-1">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, Math.ceil((problemsData?.total || 0) / pageSize)) }).map((_, i) => {
                  const p = i + 1; // Simplified pagination for now
                  return (
                    <button 
                      key={p}
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] h-8 rounded text-xs transition-colors ${
                        page === p 
                          ? 'bg-primary text-primary-foreground font-medium' 
                          : 'border border-border bg-background hover:bg-accent'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button 
                  disabled={page >= Math.ceil((problemsData?.total || 0) / pageSize)}
                  onClick={() => setPage(p => p + 1)}
                  className="p-1.5 rounded border border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 shrink-0 space-y-6 hidden lg:block">
          {/* Progress Card */}
          <div className="relative group/card">
            {!isAuthenticated && <SidebarOverlay />}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">LaTeX 技能树</h3>
              <div className="flex items-center justify-between mb-2">
                <div className="relative w-24 h-24 flex items-center justify-center">
                   <svg className="hidden">
                     {/* Placeholder for chart lib if needed, using generic ring */}
                   </svg>
                   <div className="w-20 h-20 rounded-full border-8 border-muted flex items-center justify-center relative">
                      <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-500 rotate-45"></div>
                      <div className="text-center">
                        <span className="block text-xl font-bold">42</span>
                        <span className="text-[10px] text-muted-foreground">已掌握</span>
                      </div>
                   </div>
                </div>
                <div className="flex-1 pl-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>基础排版</span>
                      <span>20/50</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[40%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>数学公式</span>
                      <span>15/120</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 w-[12.5%]"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>图形绘制</span>
                      <span>7/80</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[8.75%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="relative group/card">
            {!isAuthenticated && <SidebarOverlay />}
            <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">打卡日历</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">2026年 2月</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-muted-foreground">
                <span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium">
                <span className="text-muted-foreground/30">1</span>
                <span className="text-muted-foreground/30">2</span>
                <span className="text-muted-foreground/30">3</span>
                {[...Array(28)].map((_, i) => (
                   <div key={i} className={`h-8 w-8 flex items-center justify-center rounded-full mx-auto ${
                     i === 18 ? 'bg-primary text-primary-foreground' : 
                     i % 3 === 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 relative' : 
                     'hover:bg-muted text-foreground'
                   }`}>
                     {i + 1}
                     {i % 3 === 0 && <span className="absolute bottom-0.5 w-1 h-1 bg-current rounded-full"></span>}
                   </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-foreground text-base">42</span>
                  <span>连续打卡</span>
                </div>
                <div className="w-px h-8 bg-border"></div>
                <div className="flex flex-col items-center">
                  <span className="font-bold text-foreground text-base">365</span>
                  <span>历史最高</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard or Featured */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Latex 排版周赛 🏆</h3>
            <p className="text-indigo-100 text-sm mb-4 relative z-10">
              每周日上午 10:30，挑战更复杂的 LaTeX 公式，赢取会员与周边。
            </p>
            <button className="w-full py-2 bg-white text-indigo-600 font-bold rounded-xl text-sm shadow hover:bg-indigo-50 transition-colors relative z-10">
              立即报名
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
