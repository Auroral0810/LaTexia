import { db } from '../../db';
import { leaderboardSnapshots } from '../../db/schema/system';
import { users } from '../../db/schema/users';
import { eq, and, desc } from 'drizzle-orm';

export interface LeaderboardQuery {
  periodType: 'daily' | 'weekly' | 'monthly' | 'all_time';
  periodKey: string;
  limit?: number;
}

/**
 * 获取排行榜数据
 */
export async function getLeaderboard(query: LeaderboardQuery) {
  const limit = query.limit || 50;

  const results = await db.select({
    id: leaderboardSnapshots.id,
    userId: leaderboardSnapshots.userId,
    username: users.username,
    avatarUrl: users.avatarUrl,
    score: leaderboardSnapshots.score,
    correctCount: leaderboardSnapshots.correctCount,
    attemptCount: leaderboardSnapshots.attemptCount,
    accuracyRate: leaderboardSnapshots.accuracyRate,
    rank: leaderboardSnapshots.rank,
    updatedAt: leaderboardSnapshots.updatedAt,
  })
  .from(leaderboardSnapshots)
  .innerJoin(users, eq(leaderboardSnapshots.userId, users.id))
  .where(
    and(
      eq(leaderboardSnapshots.periodType, query.periodType),
      eq(leaderboardSnapshots.periodKey, query.periodKey)
    )
  )
  .orderBy(desc(leaderboardSnapshots.score))
  .limit(limit);

  return results;
}
