import { pgTable, uuid, varchar, text, timestamp, boolean, inet } from 'drizzle-orm/pg-core';
import { users } from './users';

/**
 * 2.2.2 用户会话表 user_sessions
 * 存储 Refresh Token 会话，支持多设备管理
 */
export const userSessions = pgTable('user_sessions', {
  // 会话 ID（即 Refresh Token JTI）
  id: uuid('id').defaultRandom().primaryKey(),
  // 所属用户
  userId: uuid('user_id').references(() => users.id).notNull(),
  // Refresh Token 哈希
  refreshTokenHash: varchar('refresh_token_hash', { length: 255 }).notNull(),
  // 设备 UA
  userAgent: text('user_agent'),
  // 登录 IP
  ipAddress: inet('ip_address'),
  // 设备名称（前端推断）
  deviceName: varchar('device_name', { length: 100 }),
  // 是否已撤销
  isRevoked: boolean('is_revoked').default(false),
  // 过期时间
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  // 创建时间
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;
