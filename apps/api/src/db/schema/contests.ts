import { pgTable, uuid, varchar, text, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * 2.2.13 比赛表 contests
 */
export const contests = pgTable('contests', {
  // 比赛 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 比赛标题
  title: varchar('title', { length: 200 }).notNull(),
  // 比赛描述
  description: text('description'),
  // 状态：upcoming / ongoing / ended
  status: varchar('status', { length: 20 }).default('upcoming'),
  // 开始时间
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  // 结束时间
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
  // 比赛时长（分钟）
  durationMinutes: integer('duration_minutes').notNull(),
  // 最大参与人数（NULL 表示不限）
  maxParticipants: integer('max_participants'),
  // 题目 ID 数组（有序），PostgreSQL UUID[]
  problemIds: uuid('problem_ids').array().notNull(),
  // 创建者
  createdBy: uuid('created_by').references(() => users.id),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/**
 * 2.2.14 比赛参与记录表 contest_participants
 * 唯一约束：(contest_id, user_id)
 */
export const contestParticipants = pgTable('contest_participants', {
  // 记录 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 比赛
  contestId: uuid('contest_id').references(() => contests.id).notNull(),
  // 用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 得分
  score: integer('score').default(0),
  // 正确题数
  correctCount: integer('correct_count').default(0),
  // 最终排名
  rank: integer('rank'),
  // 提交时间（比赛结束或提前完成）
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  // 参赛时间
  joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  // 每个用户在每场比赛中只能参加一次
  uniqueContestUser: uniqueIndex('idx_contest_user').on(t.contestId, t.userId),
}));

export type Contest = typeof contests.$inferSelect;
export type NewContest = typeof contests.$inferInsert;
