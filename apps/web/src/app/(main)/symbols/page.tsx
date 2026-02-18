
'use client';

import React, { useEffect, useState, startTransition } from 'react';
import { useSymbolsStore } from '@/store/useSymbolsStore';
import { SymbolCard } from '@/components/SymbolCard';
import { Pagination } from '@/components/Pagination';
import { Input } from '@latexia/ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';
import { Loader2, Search, LayoutGrid, List as ListIcon, Table as TableIcon, Copy, Check } from 'lucide-react';
import { Button } from '@latexia/ui/components/ui/button';
import { Badge } from '@latexia/ui/components/ui/badge';
import { cn } from '@latexia/ui/lib/utils';
import { HighlightText } from '@/components/HighlightText';
import { toast } from '@/hooks/use-toast';

// Minimal debounce hook
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

const CATEGORY_MAP: Record<string, string> = {
  'all': '全部',
  'basic': '基础符号',
  'math': '数学符号',
  'greek': '希腊字母',
  'arrow': '箭头',
  'relation': '关系运算符',
  'delimiter': '定界符',
  'operator': '大型运算符',
  'text': '文本符号',
  'other': '其他'
};

const VIEW_OPTIONS = [
  { value: 'grid', label: '网格', icon: LayoutGrid },
  { value: 'list', label: '列表', icon: ListIcon },
  { value: 'table', label: '表格', icon: TableIcon },
] as const;

// 60, 120, 180 are divisible by 2, 3, 4, 5, 6, 10, 12...
// Great for responsive grids
const PAGE_SIZE_OPTIONS = [60, 120, 180, 240];

export default function SymbolsPage() {
  const { symbols, meta, isLoading, error, fetchSymbols } = useSymbolsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounceValue(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [pageSize, setPageSize] = useState<number>(60);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Fetch when params change
  useEffect(() => {
    fetchSymbols({
      page: 1, // Reset to page 1 on filter change
      limit: pageSize,
      category: selectedCategory,
      q: debouncedSearch
    });
  }, [debouncedSearch, selectedCategory, pageSize, fetchSymbols]);

  const handlePageChange = (newPage: number) => {
    fetchSymbols({
        page: newPage,
        limit: pageSize,
        category: selectedCategory,
        q: debouncedSearch
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`已复制: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="container mx-auto py-8 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
             <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  LaTeX 符号大全
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  收录 {meta.total} 个常用 LaTeX 符号，支持 Unicode 原生显示与一键复制
                </p>
            </div>
            
            {/* View Mode & Page Size Controls */}
            <div className="flex flex-wrap items-center gap-3">
                 <div className="flex items-center border rounded-md bg-muted/30 p-1">
                    {VIEW_OPTIONS.map((option) => (
                        <Button
                            key={option.value}
                            variant={viewMode === option.value ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode(option.value)}
                            className="h-8 px-3 gap-2 transition-all"
                        >
                            <option.icon className="h-4 w-4" />
                            <span className="hidden sm:inline text-xs">{option.label}</span>
                        </Button>
                    ))}
                 </div>

                 <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(Number(v))}>
                    <SelectTrigger className="w-[120px] h-9 text-xs">
                        <SelectValue placeholder="每页条数" />
                    </SelectTrigger>
                    <SelectContent>
                        {PAGE_SIZE_OPTIONS.map(size => (
                            <SelectItem key={size} value={size.toString()}>
                                每页 {size} 条
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="搜索符号名称、代码或描述..."
                    className="pl-9 bg-background focus-visible:ring-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="w-full sm:w-[180px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(CATEGORY_MAP).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse text-sm">正在加载符号库...</p>
        </div>
      ) : error ? (
        <div className="text-center text-destructive py-20 bg-destructive/5 rounded-xl border border-destructive/20">
          <p className="font-semibold">加载失败</p>
          <p className="text-sm opacity-80 mt-1">{error}</p>
          <Button variant="outline" onClick={() => fetchSymbols()} className="mt-4 bg-background">
            重试
          </Button>
        </div>
      ) : symbols.length === 0 ? (
         <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-xl bg-muted/10">
            未找到匹配的符号
        </div>
      ) : (
        <>
            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
                    {symbols.map(symbol => (
                        <SymbolCard key={symbol.id} symbol={symbol} searchQuery={debouncedSearch} />
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                     {symbols.map(symbol => (
                         <div key={symbol.id} className="flex items-center gap-4 p-3 bg-card border rounded-lg hover:border-primary/50 transition-colors group relative">
                            <div className="w-12 h-12 flex items-center justify-center bg-muted/50 rounded-md text-2xl font-serif">
                                {symbol.unicode || '?'}
                            </div>
                            <div className="flex-1 min-w-0 pr-8">
                                <div className="flex items-center gap-2 mb-1">
                                    <code className="text-sm font-bold text-primary truncate select-all">
                                        <HighlightText text={symbol.latexCode} highlight={debouncedSearch} />
                                    </code>
                                    <Badge variant="outline" className="text-[10px] h-4 px-1">{symbol.category}</Badge>
                                </div>
                                <div className="text-xs font-medium truncate">
                                    <HighlightText text={symbol.name} highlight={debouncedSearch} />
                                </div>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">
                                    <HighlightText text={symbol.description || '暂无描述'} highlight={debouncedSearch} />
                                </p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" 
                                onClick={() => handleCopy(symbol.latexCode, symbol.id)}
                            >
                                {copiedId === symbol.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                         </div>
                     ))}
                </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="border rounded-lg overflow-hidden bg-card">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground font-medium border-b sticky top-0">
                            <tr>
                                <th className="p-3 w-16 text-center">预览</th>
                                <th className="p-3 w-40">代码 (LaTeX)</th>
                                <th className="p-3">名称</th>
                                <th className="p-3 hidden md:table-cell">分类</th>
                                <th className="p-3 hidden md:table-cell w-1/3">描述</th>
                                <th className="p-3 w-16 text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {symbols.map(symbol => (
                                <tr key={symbol.id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="p-3 text-center text-xl font-serif">{symbol.unicode || '?'}</td>
                                    <td className="p-3">
                                        <code className="bg-muted px-1.5 py-0.5 rounded text-primary select-all">
                                            <HighlightText text={symbol.latexCode} highlight={debouncedSearch} />
                                        </code>
                                    </td>
                                    <td className="p-3 font-medium">
                                        <HighlightText text={symbol.name} highlight={debouncedSearch} />
                                    </td>
                                    <td className="p-3 hidden md:table-cell">
                                        <Badge variant="outline" className="text-[10px]">{CATEGORY_MAP[symbol.category] || symbol.category}</Badge>
                                    </td>
                                    <td className="p-3 hidden md:table-cell text-muted-foreground truncate max-w-xs" title={symbol.description || ''}>
                                        <HighlightText text={symbol.description || ''} highlight={debouncedSearch} />
                                    </td>
                                    <td className="p-3 text-center">
                                         <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" 
                                            onClick={() => handleCopy(symbol.latexCode, symbol.id)}
                                        >
                                            {copiedId === symbol.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
                <div className="text-sm text-muted-foreground">
                    显示 <span className="font-medium text-foreground">{(meta.page - 1) * meta.limit + 1}</span> - <span className="font-medium text-foreground">{Math.min(meta.page * meta.limit, meta.total)}</span> 条，共 <span className="font-medium text-foreground">{meta.total}</span> 条
                </div>
                <Pagination 
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
      )}
    </div>
  );
}
