'use client';

import React from 'react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';


export default function PracticePage() {
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
                共 <span className="font-bold text-foreground">1234</span> 道题目
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['全部', '基础排版', '数学公式', '表格制作', '图形绘制', '参考文献'].map((tag, i) => (
                <button 
                  key={tag} 
                  className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                    i === 0 
                      ? 'bg-primary text-primary-foreground font-medium' 
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex gap-4 pt-2">
               <input 
                 type="text" 
                 placeholder="搜索题目编号或名称..." 
                 className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 max-w-sm"
               />
               <Select>
                 <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="难度" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="easy">简单</SelectItem>
                   <SelectItem value="medium">中等</SelectItem>
                   <SelectItem value="hard">困难</SelectItem>
                 </SelectContent>
               </Select>
               
               <Select>
                 <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="状态" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="todo">未开始</SelectItem>
                   <SelectItem value="solved">已解决</SelectItem>
                   <SelectItem value="attempted">尝试过</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          {/* Problem Table */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="px-6 py-4 font-medium w-16">状态</th>
                    <th className="px-6 py-4 font-medium">题目</th>
                    <th className="px-6 py-4 font-medium w-24">通过率</th>
                    <th className="px-6 py-4 font-medium w-24">难度</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    // Basic Formatting
                    { id: 1, title: '实现段落首行缩进', slug: 'paragraph-indent', rate: '85.2%', difficulty: '简单', status: 'solved', tag: '基础排版' },
                    { id: 2, title: '设置字体颜色与大小', slug: 'font-styling', rate: '78.5%', difficulty: '简单', status: 'solved', tag: '基础排版' },
                    // Math Formulas
                    { id: 10, title: '勾股定理公式排版', slug: 'pythagorean-theorem', rate: '65.3%', difficulty: '简单', status: 'attempted', tag: '数学公式' },
                    { id: 11, title: '二次方程求根公式', slug: 'quadratic-formula', rate: '58.1%', difficulty: '中等', status: 'todo', tag: '数学公式' },
                    { id: 12, title: '麦克斯韦方程组', slug: 'maxwell-equations', rate: '42.7%', difficulty: '困难', status: 'todo', tag: '数学公式' },
                    // Tables
                    { id: 20, title: '创建一个三线表', slug: 'three-line-table', rate: '55.4%', difficulty: '中等', status: 'solved', tag: '表格制作' },
                    { id: 21, title: '合并单元格与多行表头', slug: 'multirow-multicolumn', rate: '38.2%', difficulty: '困难', status: 'todo', tag: '表格制作' },
                    // TikZ
                    { id: 30, title: '绘制简单流程图节点', slug: 'tikz-flowchart-node', rate: '45.1%', difficulty: '中等', status: 'attempted', tag: '图形绘制' },
                  ].map((problem) => (
                    <tr key={problem.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        {problem.status === 'solved' && <span className="text-green-500">✓</span>}
                        {problem.status === 'attempted' && <span className="text-yellow-500">?</span>}
                        {problem.status === 'todo' && <span className="text-muted-foreground/30"></span>}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/practice/${problem.id}`} className="font-medium hover:text-primary transition-colors block">
                          {problem.id}. {problem.title}
                        </Link>
                        <span className="text-xs text-muted-foreground mt-0.5 block">{problem.tag}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{problem.rate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          problem.difficulty === '简单' ? 'bg-green-500/10 text-green-600' :
                          problem.difficulty === '中等' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-red-500/10 text-red-600'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Placeholder */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <span className="text-muted-foreground text-xs">显示 1-8 共 1234 条</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 rounded border border-input bg-background hover:bg-accent text-xs">上一页</button>
                <button className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs">1</button>
                <button className="px-3 py-1 rounded border border-input bg-background hover:bg-accent text-xs">2</button>
                <button className="px-3 py-1 rounded border border-input bg-background hover:bg-accent text-xs">...</button>
                <button className="px-3 py-1 rounded border border-input bg-background hover:bg-accent text-xs">下一页</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 shrink-0 space-y-6 hidden lg:block">
          {/* Progress Card */}
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

          {/* Calendar Card */}
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

          {/* Leaderboard or Featured */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-lg mb-2 relative z-10">Latex 排版周赛 🏆</h3>
            <p className="text-indigo-100 text-sm mb-4 relative z-10">
              每周日上午 10:30，挑战更复杂的论文排版，赢取会员与周边。
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
