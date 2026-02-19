'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { StatsHero } from '@/components/profile/StatsHero';
import { ContributionHeatmap } from '@/components/profile/ContributionHeatmap';
import { ActivityLog } from '@/components/profile/ActivityLog';
import { SkillTreeOverview } from '@/components/profile/SkillTreeOverview';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, token, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [heatmapYear, setHeatmapYear] = useState<string | number>('last');
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [isHeatmapLoading, setIsHeatmapLoading] = useState(false);

  // 计算可选择的年份
  const availableYears = useMemo(() => {
    if (!authUser?.createdAt) return [new Date().getFullYear()];
    const startYear = new Date(authUser.createdAt).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= startYear; y--) {
      years.push(y);
    }
    return years;
  }, [authUser]);

  useEffect(() => {
    if (!isAuthenticated || !authUser) {
      router.push('/login');
      return;
    }

    async function fetchData() {
      try {
        const headers = {
          'X-User-Id': authUser?.id || '',
        };
        const options = { token: token || '', headers };

        const [userRes, summaryRes, heatmapRes, activityRes, skillRes] = await Promise.all([
          api.get<any>('/api/auth/profile', options),
          api.get<any>('/api/users/stats/summary', options),
          api.get<any>(`/api/users/stats/heatmap${heatmapYear === 'last' ? '' : `?year=${heatmapYear}`}`, options),
          api.get<any>('/api/users/stats/activity', options),
          api.get<any>('/api/users/stats/skill', options),
        ]);

        setUser(userRes.data.user);
        setHeatmapData(heatmapRes.data);
        setData({
          summary: summaryRes.data,
          activity: activityRes.data,
          skills: skillRes.data,
        });
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isAuthenticated, authUser, token, router]); // 初始加载全部

  // 仅在年份变化时更新热力图数据
  useEffect(() => {
    if (loading || !isAuthenticated || !authUser) return;

    async function fetchHeatmap() {
      setIsHeatmapLoading(true);
      try {
        const headers = { 'X-User-Id': authUser?.id || '' };
        const options = { token: token || '', headers };
        const res = await api.get<any>(`/api/users/stats/heatmap${heatmapYear === 'last' ? '' : `?year=${heatmapYear}`}`, options);
        setHeatmapData(res.data);
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error);
      } finally {
        setIsHeatmapLoading(false);
      }
    }

    if (!loading) fetchHeatmap();
  }, [heatmapYear]);

  if (loading) {
    return (
      <div className="container max-w-6xl py-10 space-y-8 animate-in fade-in duration-500">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || !data) {
    return (
      <div className="container max-w-6xl py-20 text-center">
        <h2 className="text-xl font-bold">无法加载用户信息</h2>
        <p className="text-muted-foreground mt-2">请尝试重新登录</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 顶部英雄区域 */}
      <StatsHero user={user} summary={data.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 活跃度热力图 */}
          <div className={isHeatmapLoading ? 'opacity-50 transition-opacity' : ''}>
            <ContributionHeatmap 
              data={heatmapData} 
              selectedYear={heatmapYear}
              availableYears={availableYears}
              onYearChange={setHeatmapYear}
            />
          </div>
          
          {/* 活动日志 */}
          <ActivityLog logs={data.activity} />
        </div>

        {/* 右侧边栏 */}
        <div className="space-y-8">
          {/* 技能树进度 */}
          <SkillTreeOverview skills={data.skills} />
          
          {/* 装饰性提示卡片 */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
             <h4 className="font-bold flex items-center gap-2">
               🚀 下一步计划
             </h4>
             <p className="text-xs text-white/80 mt-2 leading-relaxed">
               您距离达到 Level {Math.floor(data.summary.totalSolve / 10) + 2} 还差 {10 - (data.summary.totalSolve % 10)} 道题。继续加油，解锁更多高级 LaTeX 技能！
             </p>
             <Link href="/practice">
               <button className="mt-4 w-full py-2 bg-white text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/90 transition-colors">
                 立即开始练习
               </button>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

