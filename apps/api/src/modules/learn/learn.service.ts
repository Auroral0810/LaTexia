import { db } from '../../db';
import { learnChapters } from '../../db/schema/learn';
import { eq, asc, isNull, and } from 'drizzle-orm';

export interface ChapterTreeItem {
  id: number;
  title: string;
  slug: string;
  sortOrder: number;
  isPublished: boolean;
  sections: {
    id: number;
    title: string;
    slug: string;
    sortOrder: number;
  }[];
}

/**
 * 获取章节目录树
 */
export async function getChapterTree() {
  // 获取所有章节（parent_id 为空）
  const chapters = await db
    .select()
    .from(learnChapters)
    .where(and(isNull(learnChapters.parentId), eq(learnChapters.isPublished, true)))
    .orderBy(asc(learnChapters.sortOrder));

  // 获取所有小节
  const sections = await db
    .select()
    .from(learnChapters)
    .where(and(eq(learnChapters.isPublished, true)))
    .orderBy(asc(learnChapters.sortOrder));

  // 组装树结构
  return chapters.map(chapter => ({
    ...chapter,
    sections: sections
      .filter(s => s.parentId === chapter.id)
      .map(s => ({
        id: s.id,
        title: s.title,
        slug: s.slug,
        sortOrder: s.sortOrder || 0,
      }))
  }));
}

/**
 * 根据 Slug 获取详细内容
 */
export async function getChapterBySlug(slug: string) {
  const [item] = await db
    .select()
    .from(learnChapters)
    .where(eq(learnChapters.slug, slug))
    .limit(1);
  return item;
}

/**
 * 自动同步更新（后端脚本使用）
 */
export async function upsertChapter(data: any) {
  const { slug, ...updateData } = data;
  
  await db
    .insert(learnChapters)
    .values(data)
    .onConflictDoUpdate({
      target: [learnChapters.slug],
      set: updateData,
    });

  return await getChapterBySlug(slug);
}
