'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, X } from 'lucide-react';

import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@latexia/ui/components/ui/select';

interface HeatmapData {
  date: string;
  count: number;
}

interface ContributionHeatmapProps {
  data: HeatmapData[];
  selectedYear: string | number;
  availableYears: number[];
  onYearChange: (year: string | number) => void;
}

export function ContributionHeatmap({ data, selectedYear, availableYears, onYearChange }: ContributionHeatmapProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  // 根据选中的年份生成日期基础数据
  const days = useMemo(() => {
    const result = [];
    const isRolling = selectedYear === 'last';
    
    if (isRolling) {
      // 滚动最近一年的逻辑
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      for (let i = 0; i < 53 * 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (53 * 7 - 1 - i));
        const dateStr = date.toISOString().split('T')[0];
        const activity = data.find(d => d.date === dateStr);
        result.push({
          date: dateStr,
          count: activity ? activity.count : 0,
          dayOfWeek: date.getDay(),
        });
      }
    } else {
      // 特定全年的逻辑 (从该年 1 月 1 日开始)
      const yearNum = Number(selectedYear);
      const start = new Date(yearNum, 0, 1, 12, 0, 0, 0);
      
      // 找到起始周的周日 (热力图通常从周日开始一列)
      const firstDay = new Date(start);
      const offset = firstDay.getDay(); // 0 是周日
      firstDay.setDate(firstDay.getDate() - offset);

      // 渲染 53 周确保覆盖全年
      for (let i = 0; i < 53 * 7; i++) {
        const date = new Date(firstDay);
        date.setDate(firstDay.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        const activity = data.find(d => d.date === dateStr);
        result.push({
          date: dateStr,
          count: activity ? activity.count : 0,
          dayOfWeek: date.getDay(),
          isCurrentYear: date.getFullYear() === yearNum
        });
      }
    }
    return result;
  }, [data, selectedYear]);

  // 按周分组
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  // 修改颜色逻辑：使用更具对比度的颜色
  const getColor = (count: number, isDimmed?: boolean) => {
    if (isDimmed) return 'opacity-20';
    if (count === 0) return 'bg-muted/40';
    if (count <= 2) return 'bg-emerald-500/20 dark:bg-emerald-500/10';
    if (count <= 5) return 'bg-emerald-500/45 dark:bg-emerald-500/30';
    if (count <= 10) return 'bg-emerald-500/75 dark:bg-emerald-500/60';
    return 'bg-emerald-600 dark:bg-emerald-500';
  };

  const monthLabels = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    
    weeks.forEach((week, i) => {
      const date = new Date(week[0].date);
      const month = date.getMonth();
      if (month !== lastMonth) {
        labels.push({ label: months[month], index: i });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <Card className="p-6 relative">
      {showExplanation && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm p-6 flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-sm">统计数据说明</h4>
            <button onClick={() => setShowExplanation(false)} className="p-1 hover:bg-muted rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>• <strong>活跃度计算：</strong> 每个有颜色的方块代表您在该日期的在线学习行为。</p>
            <p>• <strong>包含行为：</strong> 提交练习题（无论对错）、完成章节阅读、参与公式挑战等。</p>
            <p>• <strong>颜色深度：</strong> 颜色越深代表当天的活动次数越多。浅绿色为 1-2 次，中绿色为 3-5 次，深绿色为 10 次以上。</p>
            <p>• <strong>更新频率：</strong> 数据为实时统计，如果您刚完成练习，热力图会自动更新。</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          学习贡献热力图
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-muted/40 border border-muted-foreground/5" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 border border-emerald-500/5" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/45 border border-emerald-500/5" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/75 border border-emerald-500/5" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600 border border-emerald-500/5" />
            <span>More</span>
          </div>

          <Select value={String(selectedYear)} onValueChange={onYearChange}>
            <SelectTrigger className="w-[110px] h-8 text-[10px] bg-muted/50 border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last" className="text-[10px]">最近一年</SelectItem>
              {availableYears.map(year => (
                <SelectItem key={year} value={String(year)} className="text-[10px]">{year} 年</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <TooltipProvider delayDuration={0}>
          <div className="flex gap-1 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {/* 星期标签 */}
            <div className="flex flex-col gap-[3px] pr-2 pt-6 shrink-0">
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, i) => (
                <span key={i} className="text-[9px] text-muted-foreground leading-none h-[11px] flex items-center">{day}</span>
              ))}
            </div>

            {/* 网格 */}
            <div className="flex flex-col min-w-0">
              {/* 月份标签组 */}
              <div className="flex relative h-5 mb-1">
                {monthLabels.map((l, i) => (
                  <span 
                    key={i} 
                    className="absolute text-[10px] text-muted-foreground whitespace-nowrap"
                    style={{ left: `${l.index * 14}px` }}
                  >
                    {l.label}
                  </span>
                ))}
              </div>
              
              <div className="flex gap-[3px]">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px] shrink-0">
                    {week.map((day, di) => {
                      const isDimmed = selectedYear !== 'last' && (day as any).isCurrentYear === false;
                      return (
                        <Tooltip key={di}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-[11px] h-[11px] rounded-[2px] border border-muted-foreground/10 transition-colors ${getColor(day.count, isDimmed)} cursor-default hover:ring-1 hover:ring-emerald-500/40`}
                            />
                          </TooltipTrigger>
                          {!isDimmed && (
                            <TooltipContent side="top" className="text-[10px] px-2 py-1">
                              <span className="font-bold">{day.count} 次活动</span>
                              <span className="ml-1.5 opacity-70">{day.date}</span>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TooltipProvider>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground">
          贡献度计算包含：完成练习、学习章节。
        </p>
        <button 
          onClick={() => setShowExplanation(true)}
          className="text-[10px] font-medium text-emerald-600 dark:text-emerald-500 hover:underline flex items-center gap-1 transition-all"
        >
          <Info className="w-3 h-3" />
          查看统计说明
        </button>
      </div>
    </Card>
  );
}
