import { pgTable, uuid, varchar, text, integer, boolean, serial, jsonb, numeric, timestamp, primaryKey, uniqueIndex, index, inet } from 'drizzle-orm/pg-core';
import { users } from './users';
import { problems } from './problems';
import { learnChapters } from './learn';

/**
 * 2.2.12 排行榜快照表 leaderboard_snapshots
 * 唯一约束：(user_id, period_type, period_key)
 * 索引：(period_type, period_key, score DESC) 用于排行榜查询
 */
export const leaderboardSnapshots = pgTable('leaderboard_snapshots', {
  // 记录 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 周期类型：daily / weekly / monthly / all_time
  periodType: varchar('period_type', { length: 10 }).notNull(),
  // 周期标识，如：2025-01（月）, 2025-W03（周）
  periodKey: varchar('period_key', { length: 20 }).notNull(),
  // 总得分
  score: integer('score').default(0),
  // 正确题数
  correctCount: integer('correct_count').default(0),
  // 作答题数
  attemptCount: integer('attempt_count').default(0),
  // 正确率（百分比）
  accuracyRate: numeric('accuracy_rate', { precision: 5, scale: 2 }),
  // 快照排名
  rank: integer('rank'),
  // 更新时间
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => ({
  // 每个用户在同一周期内只有一条记录
  uniqueUserPeriod: uniqueIndex('idx_leaderboard_user_period').on(t.userId, t.periodType, t.periodKey),
  // 排行榜查询索引
  periodScoreIdx: index('idx_leaderboard_period_score').on(t.periodType, t.periodKey, t.score),
}));

/**
 * 2.2.15 题目反馈表 problem_feedbacks
 */
export const problemFeedbacks = pgTable('problem_feedbacks', {
  // 记录 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 反馈题目
  problemId: uuid('problem_id').references(() => problems.id).notNull(),
  // 反馈用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // 错误类型：answer_wrong / content_error / typo / other
  errorType: varchar('error_type', { length: 50 }).notNull(),
  // 反馈描述
  description: text('description').notNull(),
  // 状态：pending / processing / resolved / dismissed
  status: varchar('status', { length: 20 }).default('pending'),
  // 管理员备注
  adminNote: text('admin_note'),
  // 处理管理员
  handledBy: uuid('handled_by').references(() => users.id),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  // 更新时间
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/**
 * 2.2.16 LaTeX 工具推荐表 tool_recommendations
 */
export const toolRecommendations = pgTable('tool_recommendations', {
  // 记录 ID
  id: serial('id').primaryKey(),
  // 工具名称
  name: varchar('name', { length: 100 }).notNull(),
  // 工具描述
  description: text('description').notNull(),
  // 工具链接
  url: text('url').notNull(),
  // 分类：editor / plugin / online / other
  category: varchar('category', { length: 50 }).notNull(),
  // LOGO 图片
  logoUrl: text('logo_url'),
  // 标签数组
  tags: text('tags').array(),
  // 是否精选
  isFeatured: boolean('is_featured').default(false),
  // 排序
  sortOrder: integer('sort_order').default(0),
  // 难度等级：Beginner, Intermediate, Advanced 等
  level: varchar('level', { length: 50 }),
  // 创建者
  createdBy: uuid('created_by').references(() => users.id),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/**
 * 2.2.17 系统配置表 system_configs
 * 主键为配置键（KV 存储）
 */
export const systemConfigs = pgTable('system_configs', {
  // 配置键（如：site.announcement）
  key: varchar('key', { length: 100 }).primaryKey(),
  // 配置值（JSON 格式）
  value: jsonb('value').notNull(),
  // 配置说明
  description: text('description'),
  // 最后修改人
  updatedBy: uuid('updated_by').references(() => users.id),
  // 最后修改时间
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

/**
 * 2.2.18 管理员操作日志表 admin_audit_logs
 */
export const adminAuditLogs = pgTable('admin_audit_logs', {
  // 日志 ID
  id: uuid('id').defaultRandom().primaryKey(),
  // 操作管理员
  adminId: uuid('admin_id').references(() => users.id).notNull(),
  // 操作类型（如：problem.delete）
  action: varchar('action', { length: 100 }).notNull(),
  // 操作目标类型（user / problem / contest）
  targetType: varchar('target_type', { length: 50 }),
  // 操作目标 ID
  targetId: text('target_id'),
  // 变更前后内容
  diff: jsonb('diff'),
  // 操作 IP
  ipAddress: inet('ip_address'),
  // 操作时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

/**
 * 2.2.21 LaTeX 符号库表 latex_symbols
 */
export const latexSymbols = pgTable('latex_symbols', {
  // 符号 ID
  id: serial('id').primaryKey(),
  // 符号名称（如：Alpha）
  name: varchar('name', { length: 100 }).notNull(),
  // LaTeX 代码（如：\alpha）
  latexCode: varchar('latex_code', { length: 200 }).notNull(),
  // 分类：math / greek / arrow / matrix / physics / other
  category: varchar('category', { length: 50 }).notNull(),
  // 符号说明
  description: text('description'),
  // 使用示例
  example: text('example'),
  // 排序
  sortOrder: integer('sort_order').default(0),
});
