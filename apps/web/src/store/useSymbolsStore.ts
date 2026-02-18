
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义符号类型
interface LatexSymbol {
  id: number;
  name: string;
  latexCode: string;
  unicode: string | null;
  category: string;
  description: string | null;
  example: string | null;
  sortOrder: number;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SymbolsState {
  symbols: LatexSymbol[];
  meta: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSymbols: (params?: { page?: number; limit?: number; category?: string; q?: string }) => Promise<void>;
}

export const useSymbolsStore = create<SymbolsState>()((set, get) => ({
  symbols: [],
  meta: {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1
  },
  isLoading: false,
  error: null,

  fetchSymbols: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', params.page.toString());
      if (params.limit) searchParams.set('limit', params.limit.toString());
      if (params.category && params.category !== 'all') searchParams.set('category', params.category);
      if (params.q) searchParams.set('q', params.q);

      const res = await fetch(`http://localhost:3001/api/symbols?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch symbols');
      
      const response = await res.json();
      if (response.success) {
        set({ 
          symbols: response.data, 
          meta: response.meta,
          isLoading: false 
        });
      } else {
        set({ error: response.message, isLoading: false });
      }
    } catch (err: any) {
      console.error(err);
      set({ error: err.message || 'Unknown error', isLoading: false });
    }
  },
}));
