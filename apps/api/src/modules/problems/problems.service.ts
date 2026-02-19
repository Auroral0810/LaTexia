import { db } from '../../db';
import { problems, problemCategories, tags, problemTags, practiceRecords } from '../../db/schema';
import { eq, and, or, ilike, sql, desc, inArray } from 'drizzle-orm';

export type ProblemDifficulty = 'easy' | 'medium' | 'hard' | 'hell';
export type ProblemStatus = 'unstarted' | 'attempted' | 'solved' | 'unknown';

export interface GetProblemsParams {
  categoryId?: number;
  tagId?: number;
  difficulty?: ProblemDifficulty;
  search?: string;
  page?: number;
  pageSize?: number;
  userId?: string;
}

/**
 * 获取题目列表，支持过滤、分页和关联用户状态
 */
export async function getProblems(params: GetProblemsParams) {
  const { categoryId, tagId, difficulty, search, page = 1, pageSize = 10, userId } = params;
  const offset = (page - 1) * pageSize;

  // 1. 构建基础查询条件
  const conditions = [];
  if (categoryId) conditions.push(eq(problems.categoryId, categoryId));
  if (difficulty) conditions.push(eq(problems.difficulty, difficulty));
  if (search) conditions.push(ilike(problems.title, `%${search}%`));
  conditions.push(eq(problems.status, 'published'));

  // 如果按标签过滤，先获取符合标签的题目 ID
  let tagFilteredProblemIds: string[] | undefined;
  if (tagId) {
    const pTags = await db
      .select({ problemId: problemTags.problemId })
      .from(problemTags)
      .where(eq(problemTags.tagId, tagId));
    tagFilteredProblemIds = pTags.map((p) => p.problemId);
    if (tagFilteredProblemIds.length === 0) {
      return { items: [], total: 0 };
    }
    conditions.push(inArray(problems.id, tagFilteredProblemIds));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 2. 查询总数
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(problems)
    .where(whereClause);

  // 3. 查询题目基本信息及分类信息
  // 注意：Drizzle 目前对关联查询的支持在复杂 join 时可能需要手动处理或使用 relational API
  // 这里我们先联查分类，状态部分单独处理（因为每个用户的状态是动态的）
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

  // 4. 并行获取所有题目的标签
  const problemIds = items.map((i) => i.id);
  const allTags = await db
    .select({
      problemId: problemTags.problemId,
      tagId: tags.id,
      tagName: tags.name,
      tagColor: tags.color,
    })
    .from(problemTags)
    .innerJoin(tags, eq(problemTags.tagId, tags.id))
    .where(inArray(problemTags.problemId, problemIds));

  // 5. 如果用户已登录，获取其练习记录
  let userRecords: Record<string, { isCorrect: boolean }> = {};
  if (userId) {
    const records = await db
      .select({
        problemId: practiceRecords.problemId,
        isCorrect: practiceRecords.isCorrect,
      })
      .from(practiceRecords)
      .where(and(eq(practiceRecords.userId, userId), inArray(practiceRecords.problemId, problemIds)))
      .orderBy(desc(practiceRecords.createdAt));

    // 按 problemId 分组，保留最新的记录
    records.forEach((r) => {
      if (!userRecords[r.problemId]) {
        userRecords[r.problemId] = { isCorrect: r.isCorrect };
      }
    });
  }

  // 6. 组装结果
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
