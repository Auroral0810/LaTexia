import { db } from '../../db';
import { formulaExercises, NewFormulaExercise } from '../../db/schema';
import { eq, sql, and, like, asc, desc, ilike } from 'drizzle-orm';

// 浏览查询参数接口
interface BrowseParams {
  page?: number;
  pageSize?: number;
  difficulty?: string;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class FormulaExercisesService {
  /**
   * 分页浏览公式题目，支持过滤、搜索、排序
   */
  static async browse(params: BrowseParams = {}) {
    const {
      page = 1,
      pageSize = 20,
      difficulty,
      category,
      search,
      sortBy = 'id',
      sortOrder = 'asc',
    } = params;

    // 构建查询条件
    const conditions = [eq(formulaExercises.status, 'published')];
    if (difficulty && difficulty !== 'all') {
      conditions.push(eq(formulaExercises.difficulty, difficulty));
    }
    if (category && category !== 'all') {
      conditions.push(eq(formulaExercises.category, category));
    }
    if (search && search.trim()) {
      conditions.push(ilike(formulaExercises.title, `%${search.trim()}%`));
    }

    const whereClause = and(...conditions);

    // 排序
    const sortColumn = sortBy === 'attemptCount' ? formulaExercises.attemptCount
      : sortBy === 'correctCount' ? formulaExercises.correctCount
      : sortBy === 'difficulty' ? formulaExercises.difficulty
      : sortBy === 'category' ? formulaExercises.category
      : formulaExercises.id;
    
    const orderFn = sortOrder === 'desc' ? desc : asc;

    // 查询总数
    const countResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(formulaExercises)
      .where(whereClause);
    const total = countResult[0]?.count ?? 0;

    // 分页查询数据
    const offset = (page - 1) * pageSize;
    const data = await db
      .select()
      .from(formulaExercises)
      .where(whereClause)
      .orderBy(orderFn(sortColumn))
      .limit(pageSize)
      .offset(offset);

    return {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * 获取所有去重类别
   */
  static async getCategories() {
    const result = await db
      .selectDistinct({ category: formulaExercises.category })
      .from(formulaExercises)
      .where(eq(formulaExercises.status, 'published'))
      .orderBy(asc(formulaExercises.category));
    return result.map(r => r.category);
  }

  /**
   * 随机获取题目，支持按难度和类别过滤
   */
  static async getRandom(difficulty?: string, limit: number = 10, category?: string) {
    const conditions = [eq(formulaExercises.status, 'published')];
    if (difficulty && difficulty !== 'all') {
      conditions.push(eq(formulaExercises.difficulty, difficulty));
    }
    if (category && category !== 'all') {
      conditions.push(eq(formulaExercises.category, category));
    }
    return await db
      .select()
      .from(formulaExercises)
      .where(and(...conditions))
      .orderBy(sql`RANDOM()`)
      .limit(limit);
  }

  static async getAll() {
    return await db
      .select()
      .from(formulaExercises)
      .orderBy(formulaExercises.id);
  }

  static async getById(id: number) {
    const rows = await db
      .select()
      .from(formulaExercises)
      .where(eq(formulaExercises.id, id))
      .limit(1);
    return rows[0] ?? null;
  }

  static async create(data: NewFormulaExercise) {
    const rows = await db
      .insert(formulaExercises)
      .values(data)
      .returning();
    return rows[0];
  }

  static async update(id: number, data: Partial<NewFormulaExercise>) {
    const rows = await db
      .update(formulaExercises)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(formulaExercises.id, id))
      .returning();
    return rows[0] ?? null;
  }

  static async delete(id: number) {
    const rows = await db
      .delete(formulaExercises)
      .where(eq(formulaExercises.id, id))
      .returning();
    return rows[0] ?? null;
  }

  static async incrementAttempt(id: number, correct: boolean) {
    if (correct) {
      await db
        .update(formulaExercises)
        .set({
          attemptCount: sql`${formulaExercises.attemptCount} + 1`,
          correctCount: sql`${formulaExercises.correctCount} + 1`,
        })
        .where(eq(formulaExercises.id, id));
    } else {
      await db
        .update(formulaExercises)
        .set({
          attemptCount: sql`${formulaExercises.attemptCount} + 1`,
        })
        .where(eq(formulaExercises.id, id));
    }
  }
}
