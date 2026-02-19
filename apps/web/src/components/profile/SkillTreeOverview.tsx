'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Network, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Skill {
  id: number;
  name: string;
  total: number;
  solved: number;
  percentage: number;
}

interface SkillTreeOverviewProps {
  skills: Skill[];
}

export function SkillTreeOverview({ skills }: SkillTreeOverviewProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Network className="w-4 h-4 text-primary" />
          LaTeX 技能树
        </h3>
        <Link href="/profile" className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-0.5">
          进入详情 <ChevronRight className="w-2 h-2" />
        </Link>
      </div>

      <div className="space-y-5">
        {skills.map((skill) => (
          <div key={skill.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold">{skill.name}</span>
              <span className="text-[10px] font-medium text-muted-foreground">
                <span className="text-primary font-bold">{skill.solved}</span> / {skill.total}
              </span>
            </div>
            <div className="relative pt-1">
              <Progress value={skill.percentage} className="h-1.5" />
              <div 
                className="absolute top-0 right-0 -mt-1 text-[9px] font-black text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {skill.percentage}%
              </div>
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <p className="text-center py-8 text-xs text-muted-foreground">暂无分类进度</p>
        )}
      </div>

      <div className="mt-8 bg-primary/5 rounded-xl p-4 border border-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-black text-primary">
              {Math.round(skills.reduce((acc, s) => acc + s.percentage, 0) / (skills.length || 1))}%
            </span>
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-primary">总体进度</div>
            <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
              你已经击败了全国 85% 的 LaTeX 学习者
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
