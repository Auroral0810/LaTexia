import { db } from '../../db';
import { problems, problemCategories, tags, problemTags, practiceRecords } from '../../db/schema';
import { eq, and, or, ilike, sql, desc, inArray } from 'drizzle-orm';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard' | 'hell';
export type ProblemStatus = 'unstarted' | 'attempted' | 'solved' | 'unknown';

export interface GetProblemsParams {
  categoryId?: number;
  tagId?: number;
  difficulty?: ProblemDifficulty;
  status?: ProblemStatus;
  search?: string;
  page?: number;
  pageSize?: number;
  userId?: string;
}

/**
 * 获取题目列表，支持过滤、分页和关联用户状态
 */
export async function getProblems(params: GetProblemsParams) {
  const { categoryId, tagId, difficulty, status, search, page = 1, pageSize = 10, userId } = params;
  const offset = (page - 1) * pageSize;

  // 1. 处理分类：如果是父分类，包含其所有子分类
  let categoryIds: number[] = [];
  if (categoryId) {
    categoryIds.push(categoryId);
    const allCategories = await db.select().from(problemCategories);
    
    // 递归查找子分类 (目前支持两级，所以直接找 parentId 匹配的)
    const children = allCategories.filter(c => c.parentId === categoryId);
    categoryIds.push(...children.map(c => c.id));
  }

  // 2. 构建基础查询条件
  const conditions = [];
  if (categoryIds.length > 0) {
    conditions.push(inArray(problems.categoryId, categoryIds));
  }
  if (difficulty) conditions.push(eq(problems.difficulty, difficulty));
  if (search) conditions.push(ilike(problems.title, `%${search}%`));
  conditions.push(eq(problems.status, 'published'));

  // 3. 处理标签过滤
  if (tagId) {
    const pTags = await db
      .select({ problemId: problemTags.problemId })
      .from(problemTags)
      .where(eq(problemTags.tagId, tagId));
    const tagFilteredProblemIds = pTags.map((p) => p.problemId);
    if (tagFilteredProblemIds.length === 0) {
      return { items: [], total: 0 };
    }
    conditions.push(inArray(problems.id, tagFilteredProblemIds));
  }

  // 4. 处理状态过滤 (必须登录且指定了状态)
  if (userId && status && status !== 'unknown') {
    if (status === 'unstarted') {
      // 未开始：题目 ID 不在该用户的练习记录中
      const startedProblemIds = db
        .select({ problemId: practiceRecords.problemId })
        .from(practiceRecords)
        .where(eq(practiceRecords.userId, userId));
      conditions.push(sql`not exists (
        select 1 from ${practiceRecords} 
        where ${practiceRecords.problemId} = ${problems.id} 
        and ${practiceRecords.userId} = ${userId}
      )`);
    } else {
      // solved 或 attempted：已经在记录中，通过 isCorrect 区分
      const isCorrect = status === 'solved';
      conditions.push(sql`exists (
        select 1 from ${practiceRecords} 
        where ${practiceRecords.problemId} = ${problems.id} 
        and ${practiceRecords.userId} = ${userId}
        and ${practiceRecords.isCorrect} = ${isCorrect}
      )`);
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 5. 查询总数
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(problems)
    .where(whereClause);

  // 6. 查询题目信息
  const items = await db
    .select({
      id: problems.id,
      title: problems.title,
      type: problems.type,
      difficulty: problems.difficulty,
      categoryId: problems.categoryId,
      categoryName: problemCategories.name,
      attemptCount: problems.attemptCount,
      correctCount: problems.correctCount,
      createdAt: problems.createdAt,
    })
    .from(problems)
    .leftJoin(problemCategories, eq(problems.categoryId, problemCategories.id))
    .where(whereClause)
    .limit(pageSize)
    .offset(offset)
    .orderBy(desc(problems.createdAt));

  if (items.length === 0) {
    return { items: [], total: Number(count) };
  }

  // 7. 补充标签和用户实时状态
  const problemIds = items.map((i) => i.id);
  const [allTags, userRecordsList] = await Promise.all([
    db
      .select({
        problemId: problemTags.problemId,
        tagId: tags.id,
        tagName: tags.name,
        tagColor: tags.color,
      })
      .from(problemTags)
      .innerJoin(tags, eq(problemTags.tagId, tags.id))
      .where(inArray(problemTags.problemId, problemIds)),
    userId 
      ? db
          .select({
            problemId: practiceRecords.problemId,
            isCorrect: practiceRecords.isCorrect,
          })
          .from(practiceRecords)
          .where(and(eq(practiceRecords.userId, userId), inArray(practiceRecords.problemId, problemIds)))
      : Promise.resolve([])
  ]);

  const userRecords: Record<string, { isCorrect: boolean }> = {};
  userRecordsList.forEach(r => {
    // 保留最新的 (如果以后由于某些原因有多条且没去重)
    if (!userRecords[r.problemId] || r.isCorrect) {
      userRecords[r.problemId] = { isCorrect: r.isCorrect };
    }
  });

  const formattedItems = items.map((item) => ({
    ...item,
    difficulty: item.difficulty as ProblemDifficulty,
    tags: allTags
      .filter((t) => t.problemId === item.id)
      .map((t) => ({ id: t.tagId, name: t.tagName, color: t.tagColor })),
    status: (userId ? (userRecords[item.id] ? (userRecords[item.id].isCorrect ? 'solved' : 'attempted') : 'unstarted') : 'unknown') as ProblemStatus,
  }));

  return {
    items: formattedItems,
    total: Number(count),
  };
}

/**
 * 获取分类和标签元数据
 */
export async function getMetadata() {
  const [categoriesList, tagsList] = await Promise.all([
    db.select().from(problemCategories).orderBy(problemCategories.sortOrder),
    db.select().from(tags).orderBy(tags.name),
  ]);

  return {
    categories: categoriesList,
    tags: tagsList,
  };
}

/**
 * 获取用户的技能树统计数据
 */
export async function getUserStats(userId: string) {
  // 获取所有一级分类
  const rootCategories = await db.select().from(problemCategories).where(sql`${problemCategories.parentId} is null`);
  const allCategories = await db.select().from(problemCategories);

  const stats = await Promise.all(rootCategories.map(async (root) => {
    // 找出该根分类下的所有子分类 ID
    const childrenIds = allCategories.filter(c => c.parentId === root.id).map(c => c.id);
    const targetIds = [root.id, ...childrenIds];

    // 该分类下的题目总数
    const [{ total }] = await db
      .select({ total: sql<number>`count(*)` })
      .from(problems)
      .where(and(eq(problems.status, 'published'), inArray(problems.categoryId, targetIds)));

    // 该用户在该分类下已解决的题目数
    const [{ solved }] = await db
      .select({ solved: sql<number>`count(distinct ${problems.id})` })
      .from(problems)
      .innerJoin(practiceRecords, eq(problems.id, practiceRecords.problemId))
      .where(and(
        eq(practiceRecords.userId, userId),
        eq(practiceRecords.isCorrect, true),
        inArray(problems.categoryId, targetIds)
      ));

    return {
      categoryId: root.id,
      categoryName: root.name,
      total: Number(total),
      solved: Number(solved),
    };
  }));

  const totalMastered = stats.reduce((acc, curr) => acc + curr.solved, 0);

  return {
    totalMastered,
    categories: stats,
  };
}

/**
 * 获取用户的打卡日历数据（近一个月）
 */
export async function getCheckinCalendar(userId: string) {
  // 获取最近 30 天的打卡记录 (有练习记录就算打卡)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const records = await db
    .select({
      date: sql<string>`TO_CHAR(${practiceRecords.createdAt}, 'YYYY-MM-DD')`,
      count: sql<number>`count(*)`
    })
    .from(practiceRecords)
    .where(and(
      eq(practiceRecords.userId, userId),
      sql`${practiceRecords.createdAt} >= ${thirtyDaysAgo}`
    ))
    .groupBy(sql`TO_CHAR(${practiceRecords.createdAt}, 'YYYY-MM-DD')`);

  // 计算连续打卡和历史最高 (简化逻辑：直接统计总天数和最长连续)
  // 真实情况可能需要更复杂的算法，这里先返回基础数据
  const masteredDates = records.map(r => r.date);
  
  return {
    dates: masteredDates, // ['2026-02-18', '2026-02-19']
    streak: records.length, // 演示用
    total: records.length,
  };
}

/**
 * 根据 ID 获取题目详情
 */
export async function getProblemById(id: string, userId?: string) {
  const [problem] = await db
    .select({
      id: problems.id,
      title: problems.title,
      content: problems.content,
      type: problems.type,
      difficulty: problems.difficulty,
      categoryId: problems.categoryId,
      categoryName: problemCategories.name,
      options: problems.options,
      answer: problems.answer,
      answerExplanation: problems.answerExplanation,
      previewImageUrl: problems.previewImageUrl,
      score: problems.score,
      attemptCount: problems.attemptCount,
      correctCount: problems.correctCount,
      createdAt: problems.createdAt,
    })
    .from(problems)
    .leftJoin(problemCategories, eq(problems.categoryId, problemCategories.id))
    .where(eq(problems.id, id))
    .limit(1);

  if (!problem) return null;

  // 获取标签
  const problemTagsList = await db
    .select({
      tagId: tags.id,
      tagName: tags.name,
      tagColor: tags.color,
    })
    .from(problemTags)
    .innerJoin(tags, eq(problemTags.tagId, tags.id))
    .where(eq(problemTags.problemId, id));

  // 获取用户答题状态
  let userStatus: ProblemStatus = 'unknown';
  if (userId) {
    const userRecord = await db
      .select({ isCorrect: practiceRecords.isCorrect })
      .from(practiceRecords)
      .where(and(eq(practiceRecords.userId, userId), eq(practiceRecords.problemId, id)))
      .limit(1);
    if (userRecord.length > 0) {
      userStatus = userRecord[0].isCorrect ? 'solved' : 'attempted';
    } else {
      userStatus = 'unstarted';
    }
  }

  return {
    ...problem,
    difficulty: problem.difficulty as ProblemDifficulty,
    tags: problemTagsList.map(t => ({ id: t.tagId, name: t.tagName, color: t.tagColor })),
    status: userStatus,
  };
}

import * as reviewService from '../review/review.service';

/**
 * 记录用户答题结果
 */
export async function recordAttempt(problemId: string, userId: string, isCorrectAnswer: boolean) {
  // 插入答题记录
  await db.insert(practiceRecords).values({
    userId,
    problemId,
    isCorrect: isCorrectAnswer,
    source: 'practice',
  });

  // 如果答错，加入复习计划
  if (!isCorrectAnswer) {
    await reviewService.addToReviewPlan(userId, problemId);
  }

  // 更新题目统计
  await db
    .update(problems)
    .set({
      attemptCount: sql`COALESCE(${problems.attemptCount}, 0) + 1`,
      ...(isCorrectAnswer ? { correctCount: sql`COALESCE(${problems.correctCount}, 0) + 1` } : {}),
    })
    .where(eq(problems.id, problemId));

  return { success: true };
}

