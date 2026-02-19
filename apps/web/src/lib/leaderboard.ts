import { api } from './api-client';

export interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string | null;
  score: number;
  correctCount: number;
  attemptCount: number;
  accuracyRate: string | null;
  rank: number | null;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * 获取排行榜
 */
export async function getLeaderboard(type: string, key: string): Promise<LeaderboardEntry[]> {
  const queryParams = new URLSearchParams();
  queryParams.append('type', type);
  queryParams.append('key', key);

  const response = await api.get<ApiResponse<LeaderboardEntry[]>>(`/api/leaderboard?${queryParams.toString()}`);
  if (!response.success) {
    throw new Error(response.message || '获取排行榜失败');
  }
  return response.data;
}
