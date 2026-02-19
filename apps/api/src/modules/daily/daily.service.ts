import { db } from '../../db';
import { dailyProblems } from '../../db/schema/practice';
import { problems } from '../../db/schema/problems';
import { problemCategories } from '../../db/schema/categories';
import { eq, sql, and } from 'drizzle-orm';

/**
 * 获取今日题目
 * 如果今天还没有题目，则随机选取一道并存入 daily_problems 表
 */
export async function getDailyProblem() {
  const today = new Date().toISOString().split('T')[0];

  // 1. 检查今日是否已存在题目
  const existingDaily = await db.select({
    id: dailyProblems.id,
    problemId: dailyProblems.problemId,
  })
  .from(dailyProblems)
  .where(eq(dailyProblems.date, today))
  .limit(1);

  let targetId: string;

  if (existingDaily.length > 0) {
    targetId = existingDaily[0].problemId;
  } else {
    // 2. 随机选取一道题目
    // 使用 RANDOM() 进行简单随机。后期可以考虑排除已选过的题目或按难度等条件筛选
    const randomProblem = await db.select({ id: problems.id })
      .from(problems)
      .orderBy(sql`RANDOM()`)
      .limit(1);

    if (randomProblem.length === 0) {
      throw new Error('没有可用的题目');
    }

    targetId = randomProblem[0].id;

    // 3. 存入 daily_problems
    try {
      await db.insert(dailyProblems).values({
        problemId: targetId,
        date: today,
      });
    } catch (error: any) {
      // 防止并发插入导致的唯一约束冲突
      if (error.code === '23505') {
        const retryDaily = await db.select({ problemId: dailyProblems.problemId })
          .from(dailyProblems)
          .where(eq(dailyProblems.date, today))
          .limit(1);
        targetId = retryDaily[0].problemId;
      } else {
        throw error;
      }
    }
  }

  // 4. 获取题目详细信息
  const detail = await db.select({
    id: problems.id,
    title: problems.title,
    type: problems.type,
    difficulty: problems.difficulty,
    categoryId: problems.categoryId,
    categoryName: problemCategories.name,
    attemptCount: problems.attemptCount,
    correctCount: problems.correctCount,
  })
  .from(problems)
  .leftJoin(problemCategories, eq(problems.categoryId, problemCategories.id))
  .where(eq(problems.id, targetId))
  .limit(1);

  return detail[0];
}
