import { pgTable, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * 2.2.1 用户表 users
 * 存储用户基本信息、OAuth 绑定、偏好设置
 */
export const users = pgTable('users', {
  // 用户主键
  id: uuid('id').defaultRandom().primaryKey(),
  // 用户名/昵称
  username: varchar('username', { length: 50 }).unique().notNull(),
  // 邮箱（OAuth 用户可为空）
  email: varchar('email', { length: 255 }).unique(),
  // 手机号
  phone: varchar('phone', { length: 20 }).unique(),
  // bcrypt 哈希（OAuth 用户为空）
  passwordHash: varchar('password_hash', { length: 255 }),
  // 头像 URL
  avatarUrl: text('avatar_url'),
  // 个人简介
  bio: text('bio'),
  // 角色：user / admin / super_admin
  role: varchar('role', { length: 20 }).notNull().default('user'),
  // 状态：active / banned / deleted
  status: varchar('status', { length: 20 }).notNull().default('active'),
  // GitHub OAuth ID
  githubId: varchar('github_id', { length: 50 }).unique(),
  // Google OAuth ID
  googleId: varchar('google_id', { length: 50 }).unique(),
  // Apple Sign In ID
  appleId: varchar('apple_id', { length: 255 }).unique(),
  // QQ OAuth ID
  qqId: varchar('qq_id', { length: 50 }).unique(),
  // WeChat OAuth ID
  wechatId: varchar('wechat_id', { length: 50 }).unique(),
  // 语言偏好
  locale: varchar('locale', { length: 10 }).default('zh-CN'),
  // 主题：light / dark / system
  theme: varchar('theme', { length: 10 }).default('system'),
  // 注册时间
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  // 更新时间
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  // 最后登录时间
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
