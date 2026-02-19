import { api } from './api-client';

export interface ReviewProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'hell';
  type: string;
  stage: number;
  nextReviewAt: string;
}

export interface ReviewStats {
  total: number;
  due: number;
  completed: number;
}

/**
 * 获取待复习题目列表
 */
export async function getDueReviewProblems(userId: string): Promise<ReviewProblem[]> {
  const result = await api.get<{ success: boolean; data: ReviewProblem[] }>('/api/review/list', {
    headers: { 'X-User-Id': userId }
  });
  return result.data;
}

/**
 * 提交复习结果
 */
export async function submitReview(userId: string, problemId: string, isCorrect: boolean): Promise<void> {
  await api.post('/api/review/submit', { problemId, isCorrect }, {
    headers: { 'X-User-Id': userId }
  });
}

/**
 * 获取复习统计数据
 */
export async function getReviewStats(userId: string): Promise<ReviewStats> {
  const result = await api.get<{ success: boolean; data: ReviewStats }>('/api/review/stats', {
    headers: { 'X-User-Id': userId }
  });
  return result.data;
}

