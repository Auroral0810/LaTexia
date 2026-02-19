'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { User, Target, Zap, Clock, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface StatsHeroProps {
  user: any;
  summary: {
    totalSolve: number;
    correctSolve: number;
    accuracy: number;
    completedChapters: number;
    currentStreak: number;
    totalActiveDays: number;
  };
}

export function StatsHero({ user, summary }: StatsHeroProps) {
  return (
    <div className="space-y-6">
      {/* 用户资料卡片 */}
      <Card className="p-6 relative overflow-hidden border-none bg-gradient-to-br from-primary/10 via-background to-background shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
          <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">{user?.username}</h1>
              <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-1.5 mt-1">
                <User className="w-3 h-3" />
                {user?.bio || '这位 LaTeX 大师很懒，还没写简介'}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                Level {Math.floor(summary.totalSolve / 10) + 1}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                {user?.role === 'admin' ? 'Administrator' : 'Latex Student'}
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">
                注册于 {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
             <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-50">Mastery Score</div>
             <div className="text-4xl font-black text-primary">
               {summary.correctSolve * 10 }
             </div>
          </div>
        </div>
      </Card>

      {/* 核心指标网格 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Target className="w-4 h-4 text-orange-500" />} 
          label="累计解题" 
          value={summary.totalSolve} 
          unit="题"
          trend={`${summary.accuracy}% 准确率`}
        />
        <StatCard 
          icon={<Zap className="w-4 h-4 text-yellow-500" />} 
          label="当前连续" 
          value={summary.currentStreak} 
          unit="天"
          trend="Keep going!"
        />
        <StatCard 
          icon={<Trophy className="w-4 h-4 text-emerald-500" />} 
          label="掌握章节" 
          value={summary.completedChapters} 
          unit="章"
          trend="Full progress"
        />
        <StatCard 
          icon={<Clock className="w-4 h-4 text-blue-500" />} 
          label="活跃总计" 
          value={summary.totalActiveDays} 
          unit="天"
          trend="Total history"
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, unit, trend }: { icon: React.ReactNode; label: string; value: number; unit: string; trend: string }) {
  return (
    <Card className="p-4 flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className="p-1.5 bg-muted rounded-lg group-hover:bg-primary/5 transition-colors">
          {icon}
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black tracking-tighter">{value}</span>
          <span className="text-[10px] font-bold text-muted-foreground">{unit}</span>
        </div>
        <p className="text-[9px] font-medium text-muted-foreground/60 mt-1">{trend}</p>
      </div>
    </Card>
  );
}
