'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, BookOpen, MessageSquare, History } from 'lucide-react';

interface Activity {
  id: string;
  type: 'practice' | 'learn';
  title: string;
  status: boolean;
  createdAt: string;
  difficulty: string;
}

interface ActivityLogProps {
  logs: Activity[];
}

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          最近学习动态
        </h3>
        <button className="text-[10px] text-muted-foreground hover:text-primary transition-colors">查看全部</button>
      </div>

      <div className="space-y-6">
        {logs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-xs">暂无活动记录，快去练习吧！</p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div key={log.id + i} className="flex gap-4 relative group">
              {i < logs.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-border group-hover:bg-primary/20 transition-colors" />
              )}
              
              <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                log.type === 'learn' ? 'bg-blue-500/10 text-blue-500' : 
                (log.status ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500')
              }`}>
                {log.type === 'learn' ? <BookOpen className="w-3 h-3" /> : 
                  (log.status ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold leading-none">{log.title}</span>
                  <span className="text-[9px] text-muted-foreground font-medium">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                    log.type === 'learn' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'
                  }`}>
                    {log.type === 'learn' ? '学习章节' : '练习题目'}
                  </span>
                  <span className="text-[9px] text-muted-foreground opacity-60">
                    {log.type === 'practice' ? (log.status ? '解答正确' : '尝试失败') : '已阅读'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
