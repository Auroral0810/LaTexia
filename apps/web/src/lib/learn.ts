import { api } from './api-client';

export interface ChapterTreeItem {
  id: number;
  title: string;
  slug: string;
  sortOrder: number;
  sections: {
    id: number;
    title: string;
    slug: string;
    sortOrder: number;
  }[];
}

export interface ChapterContent {
  id: number;
  title: string;
  content: string;
  slug: string;
  parentId: number | null;
}

/**
 * 获取章节目录树
 */
export async function getChapterTree(): Promise<ChapterTreeItem[]> {
  const result = await api.get<{ success: boolean; data: ChapterTreeItem[] }>('/api/learn/tree', { cache: 'no-store' });
  return result.data;
}

/**
 * 根据 Slug 获取章节详情
 */
export async function getChapterBySlug(slug: string): Promise<ChapterContent> {
  const result = await api.get<{ success: boolean; data: ChapterContent }>(`/api/learn/chapters/${slug}`, { cache: 'no-store' });
  return result.data;
}
