import { pgTable, uuid, varchar, text, integer, boolean, timestamp, serial, index, uniqueIndex, date } from 'drizzle-orm/pg-core';
import { users } from './users';
import { problems } from './problems';
import { contests } from './contests';

/**
 * 2.2.7 用户练习记录表 practice_records
 * 索引：(user_id, created_at DESC), (user_id, problem_id)
 */
export const practiceRecords = pgTable('practice_records', {
  // 记录 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 题目
  problemId: uuid('problem_id').references(() => problems.id).notNull(),
  // 用户提交的答案
  submittedAnswer: text('submitted_answer'),
  // 是否正确
  isCorrect: boolean('is_correct').notNull(),
  // 答题耗时（毫秒）
  timeSpentMs: integer('time_spent_ms'),
  // 来源：practice / contest / review / daily
  source: varchar('source', { length: 20 }).default('practice'),
  // 关联比赛（若来源为 contest）
  contestId: uuid('contest_id').references(() => contests.id),
  // 作答时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  // 按用户和时间查询
  userCreatedIdx: index('idx_practice_user_created').on(t.userId, t.createdAt),
  // 按用户和题目查询
  userProblemIdx: index('idx_practice_user_problem').on(t.userId, t.problemId),
}));

/**
 * 2.2.8 收藏夹表 bookmark_folders
 */
export const bookmarkFolders = pgTable('bookmark_folders', {
  // 收藏夹 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 所属用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 收藏夹名称
  name: varchar('name', { length: 100 }).notNull(),
  // 是否默认收藏夹
  isDefault: boolean('is_default').default(false),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/**
 * 2.2.9 收藏记录表 bookmarks
 * 唯一约束：(user_id, problem_id)
 */
export const bookmarks = pgTable('bookmarks', {
  // 收藏记录 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 题目
  problemId: uuid('problem_id').references(() => problems.id).notNull(),
  // 收藏夹（可为空表示默认）
  folderId: uuid('folder_id').references(() => bookmarkFolders.id),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  // 每个用户对同一题目只能收藏一次
  uniqueUserProblem: uniqueIndex('idx_bookmark_user_problem').on(t.userId, t.problemId),
}));

/**
 * 2.2.10 错题复习计划表 review_plans
 * 唯一约束：(user_id, problem_id)
 * 索引：(user_id, next_review_at) WHERE is_completed = false
 */
export const reviewPlans = pgTable('review_plans', {
  // 计划 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 错题
  problemId: uuid('problem_id').references(() => problems.id).notNull(),
  // 当前复习阶段（1-6 对应 1/2/4/7/15/30 天）
  stage: integer('stage').default(1),
  // 下次复习时间
  nextReviewAt: timestamp('next_review_at', { withTimezone: true }).notNull(),
  // 上次复习时间
  lastReviewedAt: timestamp('last_reviewed_at', { withTimezone: true }),
  // 是否完成全部复习周期
  isCompleted: boolean('is_completed').default(false),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  // 每道错题只有一个复习计划
  uniqueUserProblem: uniqueIndex('idx_review_user_problem').on(t.userId, t.problemId),
}));

/**
 * 2.2.11 每日精选题表 daily_problems
 */
export const dailyProblems = pgTable('daily_problems', {
  // 自增 ID
  id: serial('id').primaryKey(),
  // 每日题目
  problemId: uuid('problem_id').references(() => problems.id).notNull(),
  // 日期（唯一）
  date: date('date').unique().notNull(),
  // 管理员指定（可为空表示自动选取）
  createdBy: uuid('created_by').references(() => users.id),
});
