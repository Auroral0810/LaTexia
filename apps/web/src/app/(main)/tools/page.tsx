'use client';

import Link from 'next/link';
import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface Resource {
  id: string | number;
  name: string;
  url: string;
  description: string;
  level: string;
  isFeatured: boolean;
  category: 'tutorial' | 'reference' | 'tool' | 'community';
}

async function fetchTools(): Promise<Resource[]> {
  const res = await fetch('http://localhost:3001/api/tools');
  if (!res.ok) throw new Error('Network response was not ok');
  const json = await res.json();
  return json.data;
}

export default function ToolsPage() {
  const [activeTab, setActiveTab] = React.useState('全部');
  const { data: resources, isLoading, error } = useQuery({
    queryKey: ['tools', 'all'],
    queryFn: fetchTools,
  });

  const filteredResources = React.useMemo(() => {
    if (!resources) return [];
    if (activeTab === '全部') return resources;
    const map: Record<string, string> = {
      '系统教程': 'tutorial',
      '参考手册': 'reference',
      '实用工具': 'tool',
      '技术社区': 'community'
    };
    const target = map[activeTab];
    return resources.filter(r => r.category === target);
  }, [resources, activeTab]);

  if (isLoading) {
    return (
      <div className="container py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted mx-auto rounded-md"></div>
          <div className="h-4 w-64 bg-muted mx-auto rounded-md"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-bold">加载失败</h2>
        <p className="text-muted-foreground mt-2">请稍后再试或检查后端连接。</p>
      </div>
    );
  }

  return (
    <div className="container py-10 animate-slide-up">
      {/* 头部 */}
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground">
          学习资源 <span className="text-primary">Center</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          我们为你精选了全球最优质的 LaTeX 学习站点、官方文档和社区工具，助你从入门到精通。
        </p>
      </div>

      {/* 分类切换器 */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {['全部', '系统教程', '参考手册', '实用工具', '技术社区'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 资源网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources?.map((res) => (
          <a
            key={res.id}
            href={res.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col h-full rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 shadow-sm"
          >
            {/* 官方标签 (通过 featured 逻辑等展示，这里暂时逻辑简单处理) */}
            {res.isFeatured && (
              <div className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                Official
              </div>
            )}

            <div className="mb-4">
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-primary mb-2 px-2 py-0.5 rounded-md bg-primary/5">
                {res.category === 'tutorial' && '📚 教程'}
                {res.category === 'reference' && '📖 参考'}
                {res.category === 'tool' && '🔧 工具'}
                {res.category === 'community' && '👥 社区'}
              </div>
              <h3 className="font-heading text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                {res.name}
              </h3>
            </div>

            <p className="text-sm text-muted-foreground flex-1 mb-6 leading-relaxed">
              {res.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-border/40">
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {res.level}
              </span>
              <div className="flex items-center text-primary font-semibold text-sm gap-1 group-hover:translate-x-1 transition-transform">
                立即访问
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* 底部建议 */}
      <div className="mt-20 p-8 rounded-3xl bg-muted/50 border border-border/50 text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-2">有更好的资源推荐？</h2>
        <p className="text-muted-foreground text-sm mb-6">
          如果你发现了一些质量极高的 LaTeX 学习站点、工具或开源项目，欢迎反馈给我们，我们会不断丰富这个列表。
        </p>
        <Link
          href="/about"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
        >
          联系我们
        </Link>
      </div>
    </div>
  );
}
