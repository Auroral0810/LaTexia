import { pgTable, serial, varchar, text, integer, boolean, timestamp, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * 2.2.19 教学章节表 learn_chapters
 */
export const learnChapters = pgTable('learn_chapters', {
  // 章节 ID
  id: serial('id').primaryKey(),
  // 章节标题
  title: varchar('title', { length: 200 }).notNull(),
  // 英文标题
  titleEn: varchar('title_en', { length: 200 }),
  // URL 标识
  slug: varchar('slug', { length: 100 }).unique(),
  // 内容（MDX）
  content: text('content').notNull(),
  // 排序
  sortOrder: integer('sort_order').default(0),
  // 是否发布
  isPublished: boolean('is_published').default(true),
  // 更新时间
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/**
 * 2.2.20 学习进度表 user_learn_progress
 * 联合主键：(user_id, chapter_id)
 */
export const userLearnProgress = pgTable('user_learn_progress', {
  // 用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 章节
  chapterId: integer('chapter_id').references(() => learnChapters.id).notNull(),
  // 是否完成
  isCompleted: boolean('is_completed').default(false),
  // 完成时间
  completedAt: timestamp('completed_at', { withTimezone: true }),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.chapterId] }),
}));

export type LearnChapter = typeof learnChapters.$inferSelect;
export type NewLearnChapter = typeof learnChapters.$inferInsert;
