import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * 公式训练题目表 formula_exercises
 * 存储 LaTeX 公式训练题目，支持管理员后台 CRUD
 */
export const formulaExercises = pgTable('formula_exercises', {
  id: serial('id').primaryKey(),
  // 题目标题（简短描述）
  title: varchar('title', { length: 200 }).notNull(),
  // LaTeX 公式（标准答案）
  latex: text('latex').notNull(),
  // 难度：easy / medium / hard
  difficulty: varchar('difficulty', { length: 10 }).notNull(),
  // 分类：arithmetic / algebra / calculus / geometry / physics / greek / matrix / other
  category: varchar('category', { length: 50 }).notNull(),
  // 提示文字（可选，给用户的提示）
  hint: text('hint'),
  // 状态：published / draft / archived
  status: varchar('status', { length: 20 }).default('published'),
  // 排序
  sortOrder: integer('sort_order').default(0),
  // 被练习次数
  attemptCount: integer('attempt_count').default(0),
  // 正确次数
  correctCount: integer('correct_count').default(0),
  // 创建者
  createdBy: varchar('created_by', { length: 100 }),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  // 更新时间
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type FormulaExercise = typeof formulaExercises.$inferSelect;
export type NewFormulaExercise = typeof formulaExercises.$inferInsert;
