import { api } from './api-client';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard' | 'hell';
export type ProblemStatus = 'unstarted' | 'attempted' | 'solved' | 'unknown';

export interface Tag {
  id: number;
  name: string;
  color: string | null;
}

export interface ProblemItem {
  id: string;
  title: string;
  type: string;
  difficulty: ProblemDifficulty;
  categoryId: number | null;
  categoryName: string | null;
  attemptCount: number | null;
  correctCount: number | null;
  tags: Tag[];
  status: ProblemStatus;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  nameEn: string | null;
  slug: string;
  parentId: number | null;
  icon: string | null;
  sortOrder: number | null;
}

export interface GetProblemsParams {
  categoryId?: number;
  tagId?: number;
  difficulty?: ProblemDifficulty;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProblemListResponse {
  items: ProblemItem[];
  total: number;
}

export interface ProblemMetadataResponse {
  categories: Category[];
  tags: Tag[];
}

export interface ProblemStatsResponse {
  totalMastered: number;
  categories: {
    categoryId: number;
    categoryName: string;
    total: number;
    solved: number;
  }[];
}

export interface CheckinCalendarResponse {
  dates: string[];
  streak: number;
  total: number;
}

/**
 * 获取题目列表
 */
export async function getProblems(params: GetProblemsParams): Promise<ProblemListResponse> {
  const queryParams = new URLSearchParams();
  if (params.categoryId) queryParams.append('categoryId', params.categoryId.toString());
  if (params.tagId) queryParams.append('tagId', params.tagId.toString());
  if (params.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params.status) queryParams.append('status', params.status);
  if (params.search) queryParams.append('search', params.search);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());

  const response = await api.get<ApiResponse<ProblemListResponse>>(`/api/problems?${queryParams.toString()}`);
  if (!response.success) {
    throw new Error(response.message || '获取题目列表失败');
  }
  return response.data;
}

/**
 * 获取题库元数据（分类和标签）
 */
export async function getProblemMetadata(): Promise<ProblemMetadataResponse> {
  const response = await api.get<ApiResponse<ProblemMetadataResponse>>('/api/problems/metadata');
  if (!response.success) {
    throw new Error(response.message || '获取元数据失败');
  }
  return response.data;
}

export async function getProblemStats(): Promise<ProblemStatsResponse> {
  const response = await api.get<ApiResponse<ProblemStatsResponse>>('/api/problems/stats');
  if (!response.success) {
    throw new Error(response.message || '获取统计数据失败');
  }
  return response.data;
}

export async function getCheckinCalendar(): Promise<CheckinCalendarResponse> {
  const response = await api.get<ApiResponse<CheckinCalendarResponse>>('/api/problems/calendar');
  if (!response.success) {
    throw new Error(response.message || '获取打卡日历失败');
  }
  return response.data;
}
