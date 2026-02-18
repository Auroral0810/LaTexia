
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSymbolsStore } from '@/store/useSymbolsStore';
import { SymbolCard } from '@/components/SymbolCard';
import { Pagination } from '@/components/Pagination';
import { Input } from '@latexia/ui/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@latexia/ui/components/ui/select';
import { Loader2, Search, RefreshCw, LayoutGrid, List as ListIcon } from 'lucide-react';
import { Button } from '@latexia/ui/components/ui/button';
import { Badge } from '@latexia/ui/components/ui/badge';
import { cn } from '@latexia/ui/lib/utils';

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

export default function SymbolsPage() {
  const { symbols, meta, isLoading, error, fetchSymbols } = useSymbolsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounceValue(searchQuery, 500);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    'all', 'basic', 'math', 'greek', 'arrow', 'relation', 'delimiter', 'operator', 'text', 'other'
  ]; // Hardcoded for simplified UI, or fetch dynamically

  // Fetch when params change
  useEffect(() => {
    fetchSymbols({
      page: 1, // Reset to page 1 on filter change
      limit: 60,
      category: selectedCategory,
      q: debouncedSearch
    });
  }, [debouncedSearch, selectedCategory, fetchSymbols]);

  const handlePageChange = (newPage: number) => {
    fetchSymbols({
        page: newPage, // Use current filters
        limit: meta.limit,
        category: selectedCategory,
        q: debouncedSearch
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      {/* Header Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  LaTeX Symbol Library
                </h1>
                <p className="text-muted-foreground mt-1">
                  Browse {meta.total} LaTeX symbols with Unicode support
                </p>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg">
                <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                >
                    <ListIcon className="h-4 w-4" />
                </Button>
            </div>
        </div>

        {/* Filters Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search symbols..."
                    className="pl-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="w-full md:w-[200px]">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                                <span className="capitalize">{cat}</span>
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
          <p className="text-muted-foreground animate-pulse">Loading library...</p>
        </div>
      ) : error ? (
        <div className="text-center text-destructive py-20 bg-destructive/10 rounded-xl">
          <p className="font-semibold">Error loading symbols</p>
          <p className="text-sm opacity-80">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()} className="mt-4 bg-background">
            Retry
          </Button>
        </div>
      ) : symbols.length === 0 ? (
         <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-xl">
            No symbols found matching your criteria.
        </div>
      ) : (
        <>
            <div className={cn(
                "grid gap-4",
                viewMode === 'grid' 
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8" 
                    : "grid-cols-1"
            )}>
                {symbols.map(symbol => (
                    viewMode === 'grid' ? (
                        <SymbolCard key={symbol.id} symbol={symbol} />
                    ) : (
                         // Simple List Item View
                         <div key={symbol.id} className="flex items-center justify-between p-4 bg-card border rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <span className="text-2xl font-serif w-8 text-center">{symbol.unicode || '?'}</span>
                                <div>
                                    <div className="font-mono text-sm font-bold text-primary">{symbol.latexCode}</div>
                                    <div className="text-xs text-muted-foreground">{symbol.name}</div>
                                </div>
                            </div>
                            <Badge variant="outline">{symbol.category}</Badge>
                         </div>
                    )
                ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
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
