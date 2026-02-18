import { pgTable, serial, varchar, uuid, integer, primaryKey } from 'drizzle-orm/pg-core';
import { problems } from './problems';

/**
 * 2.2.4 题目标签表 tags
 */
export const tags = pgTable('tags', {
  // 标签 ID
  id: serial('id').primaryKey(),
  // 标签名（如：矩阵、积分、希腊字母）
  name: varchar('name', { length: 50 }).unique().notNull(),
  // 标签颜色（十六进制）
  color: varchar('color', { length: 7 }),
});

/**
 * 2.2.6 题目标签关联表 problem_tags
 * 联合主键：(problem_id, tag_id)
 */
export const problemTags = pgTable('problem_tags', {
  // 题目
  problemId: uuid('problem_id').references(() => problems.id).notNull(),
  // 标签
  tagId: integer('tag_id').references(() => tags.id).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.problemId, t.tagId] }),
}));

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
