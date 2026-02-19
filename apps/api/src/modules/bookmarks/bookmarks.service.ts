import { db } from '../../db';
import { bookmarks, bookmarkFolders } from '../../db/schema/practice';
import { problems } from '../../db/schema/problems';
import { problemCategories } from '../../db/schema/categories';
import { eq, and, sql, desc, count } from 'drizzle-orm';

// ========== 收藏操作 ==========

/**
 * 切换收藏状态（收藏/取消收藏）
 */
export async function toggleBookmark(userId: string, problemId: string, folderId?: string) {
  // 检查是否已收藏
  const existing = await db.select({ id: bookmarks.id })
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.problemId, problemId)))
    .limit(1);

  if (existing.length > 0) {
    // 已收藏 → 取消收藏
    await db.delete(bookmarks).where(eq(bookmarks.id, existing[0].id));
    return { bookmarked: false };
  } else {
    // 未收藏 → 添加收藏
    const result = await db.insert(bookmarks).values({
      userId,
      problemId,
      folderId: folderId || null,
    }).returning({ id: bookmarks.id });
    return { bookmarked: true, id: result[0].id };
  }
}

/**
 * 检查题目是否已收藏
 */
export async function isBookmarked(userId: string, problemId: string) {
  const result = await db.select({ id: bookmarks.id })
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.problemId, problemId)))
    .limit(1);
  return result.length > 0;
}

/**
 * 获取收藏列表（含题目详情，支持分页和收藏夹筛选）
 */
export async function getBookmarks(userId: string, folderId?: string, page = 1, pageSize = 20) {
  // 构建查询条件
  const conditions = [eq(bookmarks.userId, userId)];
  if (folderId === 'default') {
    // 默认收藏夹 = folder_id 为 null
    conditions.push(sql`${bookmarks.folderId} IS NULL`);
  } else if (folderId) {
    conditions.push(eq(bookmarks.folderId, folderId));
  }

  // 获取总数
  const totalResult = await db.select({ count: count() })
    .from(bookmarks)
    .where(and(...conditions));
  const total = totalResult[0].count;

  // 获取收藏记录及题目详情
  const items = await db.select({
    bookmarkId: bookmarks.id,
    bookmarkedAt: bookmarks.createdAt,
    folderId: bookmarks.folderId,
    problemId: problems.id,
    title: problems.title,
    type: problems.type,
    difficulty: problems.difficulty,
    categoryId: problems.categoryId,
    categoryName: problemCategories.name,
    attemptCount: problems.attemptCount,
    correctCount: problems.correctCount,
  })
    .from(bookmarks)
    .innerJoin(problems, eq(bookmarks.problemId, problems.id))
    .leftJoin(problemCategories, eq(problems.categoryId, problemCategories.id))
    .where(and(...conditions))
    .orderBy(desc(bookmarks.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return { items, total };
}

// ========== 收藏夹操作 ==========

/**
 * 获取用户的收藏夹列表（含每个收藏夹的收藏数量）
 */
export async function getFolders(userId: string) {
  // 获取收藏夹列表
  const folders = await db.select({
    id: bookmarkFolders.id,
    name: bookmarkFolders.name,
    isDefault: bookmarkFolders.isDefault,
    createdAt: bookmarkFolders.createdAt,
  })
    .from(bookmarkFolders)
    .where(eq(bookmarkFolders.userId, userId))
    .orderBy(desc(bookmarkFolders.isDefault), bookmarkFolders.createdAt);

  // 统计每个收藏夹的收藏数量
  const folderCounts = await db.select({
    folderId: bookmarks.folderId,
    count: count(),
  })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .groupBy(bookmarks.folderId);

  // 合并数据
  const countMap = new Map(folderCounts.map(fc => [fc.folderId, fc.count]));

  // 未分类的收藏数量（folder_id = null）
  const defaultCount = countMap.get(null) || 0;

  // 总收藏数
  const totalResult = await db.select({ count: count() })
    .from(bookmarks)
    .where(eq(bookmarks.userId, userId));
  const totalCount = totalResult[0].count;

  return {
    folders: folders.map(f => ({
      ...f,
      count: countMap.get(f.id) || 0,
    })),
    defaultCount,
    totalCount,
  };
}

/**
 * 创建收藏夹
 */
export async function createFolder(userId: string, name: string) {
  const result = await db.insert(bookmarkFolders).values({
    userId,
    name,
  }).returning();
  return result[0];
}

/**
 * 重命名收藏夹
 */
export async function updateFolder(userId: string, folderId: string, name: string) {
  const result = await db.update(bookmarkFolders)
    .set({ name })
    .where(and(eq(bookmarkFolders.id, folderId), eq(bookmarkFolders.userId, userId)))
    .returning();
  return result[0];
}

/**
 * 删除收藏夹（将其中的收藏移至默认/未分类）
 */
export async function deleteFolder(userId: string, folderId: string) {
  // 先将该收藏夹下的收藏移至"未分类"
  await db.update(bookmarks)
    .set({ folderId: null })
    .where(and(eq(bookmarks.folderId, folderId), eq(bookmarks.userId, userId)));

  // 再删除收藏夹
  await db.delete(bookmarkFolders)
    .where(and(eq(bookmarkFolders.id, folderId), eq(bookmarkFolders.userId, userId)));
}
