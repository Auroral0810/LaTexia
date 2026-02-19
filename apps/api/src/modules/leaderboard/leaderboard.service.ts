import { db } from '../../db';
import { leaderboardSnapshots } from '../../db/schema/system';
import { users } from '../../db/schema/users';
import { practiceRecords } from '../../db/schema/practice';
import { problems } from '../../db/schema/problems';
import { eq, and, desc, sql } from 'drizzle-orm';

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

/**
 * 刷新排行榜快照
 */
export async function refreshSnapshots() {
  const now = new Date();
  
  // 1. 定义需要刷新的周期类型
  const periods: { type: 'daily' | 'weekly' | 'monthly' | 'all_time'; key: string; start?: Date }[] = [
    { type: 'all_time', key: 'all' },
    { type: 'daily', key: now.toISOString().split('T')[0], start: new Date(now.setHours(0, 0, 0, 0)) },
  ];

  // 如果是周一，或者为了简单起见，每次刷新也尝试刷新本周和本月（或者根据时间判断）
  // 这里我们每次刷新都更新当前活跃的周和月快照
  periods.push({ type: 'monthly', key: getMonthKey(now), start: new Date(now.getFullYear(), now.getMonth(), 1) });
  periods.push({ type: 'weekly', key: getWeekKey(now), start: getWeekStart(now) });

  console.log(`[Leaderboard] Starting snapshot refresh for ${periods.length} periods...`);

  for (const period of periods) {
    try {
      // 2. 统计用户得分
      const stats = await db.select({
        userId: practiceRecords.userId,
        score: sql<number>`SUM(CASE WHEN ${practiceRecords.isCorrect} THEN ${problems.score} ELSE 0 END)`,
        correctCount: sql<number>`COUNT(CASE WHEN ${practiceRecords.isCorrect} THEN 1 END)`,
        attemptCount: sql<number>`COUNT(*)`,
      })
      .from(practiceRecords)
      .innerJoin(problems, eq(practiceRecords.problemId, problems.id))
      .where(period.start ? sql`${practiceRecords.createdAt} >= ${period.start}` : undefined)
      .groupBy(practiceRecords.userId);

      if (stats.length === 0) continue;

      // 3. 计算排名并批量插入/更新
      // 按分数排序
      const sortedStats = stats.sort((a, b) => (Number(b.score) - Number(a.score)));

      for (let i = 0; i < sortedStats.length; i++) {
        const s = sortedStats[i];
        const score = Number(s.score);
        const correctCount = Number(s.correctCount);
        const attemptCount = Number(s.attemptCount);
        const accuracyRate = attemptCount > 0 ? (correctCount / attemptCount) * 100 : 0;

        await db.insert(leaderboardSnapshots)
          .values({
            userId: s.userId,
            periodType: period.type,
            periodKey: period.key,
            score: score,
            correctCount: correctCount,
            attemptCount: attemptCount,
            accuracyRate: accuracyRate.toFixed(2),
            rank: i + 1,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [leaderboardSnapshots.userId, leaderboardSnapshots.periodType, leaderboardSnapshots.periodKey],
            set: {
              score: score,
              correctCount: correctCount,
              attemptCount: attemptCount,
              accuracyRate: accuracyRate.toFixed(2),
              rank: i + 1,
              updatedAt: new Date(),
            },
          });
      }
      console.log(`[Leaderboard] Updated ${period.type} (${period.key}) with ${sortedStats.length} users.`);
    } catch (err) {
      console.error(`[Leaderboard] Failed to update ${period.type}:`, err);
    }
  }
}

// 辅助函数
function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getWeekKey(date: Date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

function getWeekStart(date: Date) {
  const d = new Date(date);
  const day = d.getDay() || 7;
  d.setDate(d.getDate() - day + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

