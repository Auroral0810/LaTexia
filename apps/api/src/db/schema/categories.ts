import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core';
import { AnyPgColumn } from 'drizzle-orm/pg-core';

/**
 * 2.2.3 题目分类表 problem_categories
 * 支持二级分类（parent_id 自引用）
 */
export const problemCategories = pgTable('problem_categories', {
  // 分类 ID
  id: serial('id').primaryKey(),
  // 分类名（如：数学公式、文本排版）
  name: varchar('name', { length: 100 }).notNull(),
  // 英文名
  nameEn: varchar('name_en', { length: 100 }),
  // URL 友好标识
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  // 父分类（支持二级分类）
  parentId: integer('parent_id').references((): AnyPgColumn => problemCategories.id),
  // 图标名
  icon: varchar('icon', { length: 50 }),
  // 排序权重
  sortOrder: integer('sort_order').default(0),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type ProblemCategory = typeof problemCategories.$inferSelect;
export type NewProblemCategory = typeof problemCategories.$inferInsert;
