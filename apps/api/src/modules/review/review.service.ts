import { db } from '../../db';
import { reviewPlans } from '../../db/schema/practice';
import { problems } from '../../db/schema/problems';
import { eq, and, lte, sql, count } from 'drizzle-orm';
import { getNextReviewDate, MAX_REVIEW_STAGE } from '../../utils/ebbinghaus';

/**
 * 将错题加入复习计划
 */
export async function addToReviewPlan(userId: string, problemId: string) {
  const nextReviewAt = getNextReviewDate(1);

  await db
    .insert(reviewPlans)
    .values({
      userId,
      problemId,
      stage: 1,
      nextReviewAt,
      isCompleted: false,
    })
    .onConflictDoUpdate({
      target: [reviewPlans.userId, reviewPlans.problemId],
      set: {
        stage: 1,
        nextReviewAt,
        isCompleted: false,
        lastReviewedAt: null,
      },
    });
}

/**
 * 获取待复习题目列表
 */
export async function getDueReviewProblems(userId: string) {
  return await db
    .select({
      id: problems.id,
      title: problems.title,
      difficulty: problems.difficulty,
      type: problems.type,
      stage: reviewPlans.stage,
      nextReviewAt: reviewPlans.nextReviewAt,
    })
    .from(reviewPlans)
    .innerJoin(problems, eq(reviewPlans.problemId, problems.id))
    .where(
      and(
        eq(reviewPlans.userId, userId),
        eq(reviewPlans.isCompleted, false),
        lte(reviewPlans.nextReviewAt, new Date())
      )
    );
}

/**
 * 提交复习结果
 */
export async function completeReview(userId: string, problemId: string, isCorrect: boolean) {
  const plan = await db.query.reviewPlans.findFirst({
    where: and(eq(reviewPlans.userId, userId), eq(reviewPlans.problemId, problemId)),
  });

  if (!plan) return;

  if (isCorrect) {
    const nextStage = plan.stage! + 1;
    if (nextStage > MAX_REVIEW_STAGE) {
      // 完成所有阶段
      await db
        .update(reviewPlans)
        .set({
          isCompleted: true,
          lastReviewedAt: new Date(),
        })
        .where(eq(reviewPlans.id, plan.id));
    } else {
      // 进入下一阶段
      await db
        .update(reviewPlans)
        .set({
          stage: nextStage,
          nextReviewAt: getNextReviewDate(nextStage),
          lastReviewedAt: new Date(),
        })
        .where(eq(reviewPlans.id, plan.id));
    }
  } else {
    // 答错，重置为阶段 1
    await db
      .update(reviewPlans)
      .set({
        stage: 1,
        nextReviewAt: getNextReviewDate(1),
        lastReviewedAt: new Date(),
      })
      .where(eq(reviewPlans.id, plan.id));
  }
}

/**
 * 获取复习统计数据
 */
export async function getReviewStats(userId: string) {
  const [counts] = await db
    .select({
      total: count(),
      due: sql<number>`count(*) filter (where ${reviewPlans.nextReviewAt} <= now() and ${reviewPlans.isCompleted} = false)`,
      completed: sql<number>`count(*) filter (where ${reviewPlans.isCompleted} = true)`,
    })
    .from(reviewPlans)
    .where(eq(reviewPlans.userId, userId));

  return counts;
}
