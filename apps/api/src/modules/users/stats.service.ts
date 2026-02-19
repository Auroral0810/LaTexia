import { db } from '../../db';
import { practiceRecords, learnChapters, userLearnProgress, problems, problemCategories } from '../../db/schema';
import { eq, and, sql, desc, gte, lte } from 'drizzle-orm';

/**
 * 获取学习统计摘要
 */
export async function getStatsSummary(userId: string) {
  // 1. 获取题目练习概况
  const records = await db
    .select({
      isCorrect: practiceRecords.isCorrect,
      createdAt: practiceRecords.createdAt,
    })
    .from(practiceRecords)
    .where(eq(practiceRecords.userId, userId));

  const totalSolve = records.length;
  const correctSolve = records.filter(r => r.isCorrect).length;
  const accuracy = totalSolve > 0 ? Math.round((correctSolve / totalSolve) * 100) : 0;

  // 2. 获取章节学习概况
  const [{ completedChapters }] = await db
    .select({ completedChapters: sql<number>`count(*)` })
    .from(userLearnProgress)
    .where(and(eq(userLearnProgress.userId, userId), eq(userLearnProgress.isCompleted, true)));

  // 3. 计算打卡天数与当前连续打卡 (Streak)
  const uniqueDates = Array.from(new Set(
    records.map(r => new Date(r.createdAt!).toISOString().split('T')[0])
  )).sort((a, b) => b.localeCompare(a)); // 从新到旧

  let currentStreak = 0;
  if (uniqueDates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // 如果今天或昨天没有打卡，Streak 归零或按逻辑判断
    let checkDate = uniqueDates[0] === today ? today : (uniqueDates[0] === yesterday ? yesterday : null);
    
    if (checkDate) {
      let tempDate = new Date(checkDate);
      for (const dateStr of uniqueDates) {
        if (dateStr === tempDate.toISOString().split('T')[0]) {
          currentStreak++;
          tempDate.setDate(tempDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  return {
    totalSolve,
    correctSolve,
    accuracy,
    completedChapters: Number(completedChapters),
    currentStreak,
    totalActiveDays: uniqueDates.length,
  };
}

/**
 * 获取活跃度热力图数据
 * @param userId 用户 ID
 * @param year 可选年份，如果不传则返回近一年数据
 */
export async function getHeatmapData(userId: string, year?: number) {
  let startDate: Date;
  let endDate: Date;

  if (year) {
    startDate = new Date(year, 0, 1); // 一月一日
    endDate = new Date(year, 11, 31, 23, 59, 59); // 十二月三十一日
  } else {
    startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    endDate = new Date();
  }

  const data = await db
    .select({
      date: sql<string>`TO_CHAR(${practiceRecords.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`
    })
    .from(practiceRecords)
    .where(and(
      eq(practiceRecords.userId, userId),
      gte(practiceRecords.createdAt, startDate),
      lte(practiceRecords.createdAt, endDate)
    ))
    .groupBy(sql`TO_CHAR(${practiceRecords.createdAt}, 'YYYY-MM-DD')`);

  const learnData = await db
    .select({
      date: sql<string>`TO_CHAR(${userLearnProgress.completedAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`
    })
    .from(userLearnProgress)
    .where(and(
      eq(userLearnProgress.userId, userId),
      gte(userLearnProgress.completedAt, startDate),
      lte(userLearnProgress.completedAt, endDate)
    ))
    .groupBy(sql`TO_CHAR(${userLearnProgress.completedAt}, 'YYYY-MM-DD')`);

  // 合并数据
  const heatmap: Record<string, number> = {};
  data.forEach(d => { heatmap[d.date] = (heatmap[d.date] || 0) + Number(d.count); });
  learnData.forEach(d => { heatmap[d.date] = (heatmap[d.date] || 0) + Number(d.count); });

  return Object.entries(heatmap).map(([date, count]) => ({ date, count }));
}

/**
 * 获取最近活动日志
 */
export async function getActivityLogs(userId: string, limit = 20) {
  // 1. 获取最近题目练习
  const practiceLogs = await db
    .select({
      id: practiceRecords.id,
      type: sql<string>`'practice'`,
      title: problems.title,
      status: practiceRecords.isCorrect,
      createdAt: practiceRecords.createdAt,
      difficulty: problems.difficulty,
    })
    .from(practiceRecords)
    .innerJoin(problems, eq(practiceRecords.problemId, problems.id))
    .where(eq(practiceRecords.userId, userId))
    .orderBy(desc(practiceRecords.createdAt))
    .limit(limit);

  // 2. 获取最近学习进度
  const learnLogs = await db
    .select({
      id: sql<string>`${userLearnProgress.chapterId}::text`,
      type: sql<string>`'learn'`,
      title: learnChapters.title,
      status: userLearnProgress.isCompleted,
      createdAt: userLearnProgress.completedAt,
      difficulty: sql<string>`'normal'`,
    })
    .from(userLearnProgress)
    .innerJoin(learnChapters, eq(userLearnProgress.chapterId, learnChapters.id))
    .where(eq(userLearnProgress.userId, userId))
    .orderBy(desc(userLearnProgress.completedAt))
    .limit(limit);

  // 合并并按时间排序
  const combined = [...practiceLogs, ...learnLogs]
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, limit);

  return combined;
}

/**
 * 获取技能树进度 (按分类)
 */
export async function getSkillProgress(userId: string) {
  // 获取所有顶级分类
  const roots = await db
    .select()
    .from(problemCategories)
    .where(sql`${problemCategories.parentId} is null`);

  const allCats = await db.select().from(problemCategories);

  const results = await Promise.all(roots.map(async (root) => {
    const childrenIds = allCats.filter(c => c.parentId === root.id).map(c => c.id);
    const catIds = [root.id, ...childrenIds];

    // 总题数
    const [{ total }] = await db
      .select({ total: sql<number>`count(*)` })
      .from(problems)
      .where(and(eq(problems.status, 'published'), inArray(problems.categoryId, catIds)));

    // 已掌握 (正确过)
    const [{ solved }] = await db
      .select({ solved: sql<number>`count(distinct ${problems.id})` })
      .from(practiceRecords)
      .innerJoin(problems, eq(practiceRecords.problemId, problems.id))
      .where(and(
        eq(practiceRecords.userId, userId),
        eq(practiceRecords.isCorrect, true),
        inArray(problems.categoryId, catIds)
      ));

    return {
      id: root.id,
      name: root.name,
      total: Number(total),
      solved: Number(solved),
      percentage: total > 0 ? Math.round((Number(solved) / Number(total)) * 100) : 0
    };
  }));

  return results;
}

// 辅助函数
function inArray(column: any, values: any[]) {
  if (values.length === 0) return sql`FALSE`;
  return sql`${column} IN ${values}`;
}
