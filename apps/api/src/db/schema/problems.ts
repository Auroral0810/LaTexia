import { pgTable, uuid, varchar, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';
import { problemCategories } from './categories';

/**
 * 2.2.5 题目表 problems
 * 存储题目内容、类型、难度、答案等核心信息
 */
export const problems = pgTable('problems', {
  // 题目 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 题目标题
  title: varchar('title', { length: 500 }).notNull(),
  // 题目内容（支持 Markdown + LaTeX）
  content: text('content').notNull(),
  // 题型：fill_blank / single / multiple / latex_input
  type: varchar('type', { length: 20 }).notNull(),
  // 难度：easy / medium / hard / hell
  difficulty: varchar('difficulty', { length: 10 }).notNull(),
  // 分类
  categoryId: integer('category_id').references(() => problemCategories.id),
  // 选项数组（选择题使用），[{key, content, is_correct}]
  options: jsonb('options'),
  // 标准答案（填空/LaTeX 输入题）
  answer: text('answer').notNull(),
  // 解析说明
  answerExplanation: text('answer_explanation'),
  // 题目预览图
  previewImageUrl: text('preview_image_url'),
  // 题目分值
  score: integer('score').default(10),
  // 状态：draft / published / archived
  status: varchar('status', { length: 20 }).default('published'),
  // 出题人
  authorId: uuid('author_id').references(() => users.id),
  // 被作答次数
  attemptCount: integer('attempt_count').default(0),
  // 正确次数
  correctCount: integer('correct_count').default(0),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  // 更新时间
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type Problem = typeof problems.$inferSelect;
export type NewProblem = typeof problems.$inferInsert;
