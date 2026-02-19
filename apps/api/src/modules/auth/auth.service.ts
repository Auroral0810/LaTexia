import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { eq, or } from 'drizzle-orm';
import { db } from '../../db';
import { users, type NewUser } from '../../db/schema/users';
import { userSessions } from '../../db/schema/sessions';
import { env } from '../../config/env';
import {
  setVerifyCode,
  getVerifyCode,
  deleteVerifyCode,
  isInCooldown,
  generateCode,
} from '../../config/redis';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../mail/mail.service';
import { sendSmsCode } from '../../sms/sms.service';
import { ossService } from '../oss/oss.service';


// ========== 工具函数 ==========

/** 判断是否为邮箱 */
function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** 判断是否为手机号（中国大陆） */
function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value);
}

/** 生成 JWT Access Token */
function signAccessToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN });
}

/** 生成 JWT Refresh Token */
function signRefreshToken(payload: { userId: string; sessionId: string }): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
}

/** 统一响应格式 */
type AuthResult<T = any> = { success: true; data: T } | { success: false; message: string };

// ========== 发送验证码 ==========

interface SendCodeInput {
  target: string;       // 邮箱或手机号
  type: 'register' | 'login' | 'reset' | 'bind';
}

export async function sendCode(input: SendCodeInput): Promise<AuthResult> {
  const { target, type } = input;

  // 校验目标格式
  if (!isEmail(target) && !isPhone(target)) {
    return { success: false, message: '请输入有效的邮箱或手机号' };
  }

  // 频率限制检查
  if (await isInCooldown(type, target)) {
    return { success: false, message: '发送过于频繁，请稍后再试' };
  }

  // 注册时检查目标是否已被注册
  if (type === 'register') {
    const existing = isEmail(target)
      ? await db.select({ id: users.id }).from(users).where(eq(users.email, target)).limit(1)
      : await db.select({ id: users.id }).from(users).where(eq(users.phone, target)).limit(1);
    if (existing.length > 0) {
      return { success: false, message: isEmail(target) ? '该邮箱已被注册' : '该手机号已被注册' };
    }
  }

  // 登录/重置时检查目标是否存在
  if (type === 'login' || type === 'reset') {
    const existing = isEmail(target)
      ? await db.select({ id: users.id }).from(users).where(eq(users.email, target)).limit(1)
      : await db.select({ id: users.id }).from(users).where(eq(users.phone, target)).limit(1);
    if (existing.length === 0) {
      return { success: false, message: isEmail(target) ? '该邮箱未注册' : '该手机号未注册' };
    }
  }

  // 生成并存储验证码
  const code = generateCode();
  await setVerifyCode(type, target, code);

  // 发送验证码
  try {
    if (isEmail(target)) {
      if (type === 'reset') {
        await sendPasswordResetEmail(target, code);
      } else {
        await sendVerificationEmail(target, code);
      }
    } else {
      await sendSmsCode(target, code);
    }
  } catch (err) {
    console.error('[Auth] 验证码发送失败:', err);
    return { success: false, message: '验证码发送失败，请稍后重试' };
  }

  return { success: true, data: { message: '验证码已发送' } };
}

// ========== 注册 ==========

interface RegisterInput {
  username: string;
  target: string;   // 邮箱或手机号
  code: string;     // 验证码
  password: string;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const { username, target, code, password } = input;

  // 校验用户名
  if (!username || username.length < 2 || username.length > 50) {
    return { success: false, message: '用户名长度需在 2-50 个字符之间' };
  }

  // 校验密码
  if (!password || password.length < 8) {
    return { success: false, message: '密码长度不能少于 8 位' };
  }

  // 校验验证码
  const storedCode = await getVerifyCode('register', target);
  if (!storedCode || storedCode !== code) {
    return { success: false, message: '验证码错误或已过期' };
  }

  // 检查用户名是否已存在
  const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.username, username)).limit(1);
  if (existingUser.length > 0) {
    return { success: false, message: '用户名已被占用' };
  }

  // 检查邮箱/手机是否已注册
  const isEmailTarget = isEmail(target);
  const existingTarget = isEmailTarget
    ? await db.select({ id: users.id }).from(users).where(eq(users.email, target)).limit(1)
    : await db.select({ id: users.id }).from(users).where(eq(users.phone, target)).limit(1);
  if (existingTarget.length > 0) {
    return { success: false, message: isEmailTarget ? '该邮箱已被注册' : '该手机号已被注册' };
  }

  // 哈希密码
  const passwordHash = await bcrypt.hash(password, 12);

  // 创建用户
  const newUser: NewUser = {
    username,
    email: isEmailTarget ? target : undefined,
    phone: !isEmailTarget ? target : undefined,
    passwordHash,
  };

  const [created] = await db.insert(users).values(newUser).returning({
    id: users.id,
    username: users.username,
    role: users.role,
    avatarUrl: users.avatarUrl,
  });

  // 清除验证码
  await deleteVerifyCode('register', target);

  // 生成 token
  const tokenData = await createSession(created.id, created.role);

  return {
    success: true,
    data: {
      user: created,
      ...tokenData,
    },
  };
}

// ========== 密码登录 ==========

interface LoginByPasswordInput {
  identifier: string;  // 用户名 / 邮箱 / 手机号
  password: string;
}

export async function loginByPassword(input: LoginByPasswordInput): Promise<AuthResult> {
  const { identifier, password } = input;

  // 查找用户
  const [user] = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.username, identifier),
        eq(users.email, identifier),
        eq(users.phone, identifier),
      )
    )
    .limit(1);

  if (!user) {
    return { success: false, message: '账号或密码错误' };
  }

  if (user.status !== 'active') {
    return { success: false, message: '账户已被禁用' };
  }

  if (!user.passwordHash) {
    return { success: false, message: '该账户未设置密码，请使用其他方式登录' };
  }

  // 校验密码
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { success: false, message: '账号或密码错误' };
  }

  // 更新最后登录时间
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

  // 生成 token
  const tokenData = await createSession(user.id, user.role);

  return {
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokenData,
    },
  };
}

// ========== 验证码登录 ==========

interface LoginByCodeInput {
  target: string;   // 邮箱或手机号
  code: string;
}

export async function loginByCode(input: LoginByCodeInput): Promise<AuthResult> {
  const { target, code } = input;

  // 校验验证码
  const storedCode = await getVerifyCode('login', target);
  if (!storedCode || storedCode !== code) {
    return { success: false, message: '验证码错误或已过期' };
  }

  // 查找用户
  const isEmailTarget = isEmail(target);
  const [user] = isEmailTarget
    ? await db.select().from(users).where(eq(users.email, target)).limit(1)
    : await db.select().from(users).where(eq(users.phone, target)).limit(1);

  if (!user) {
    return { success: false, message: '该账号未注册' };
  }

  if (user.status !== 'active') {
    return { success: false, message: '账户已被禁用' };
  }

  // 清除验证码
  await deleteVerifyCode('login', target);

  // 更新最后登录时间
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

  // 生成 token
  const tokenData = await createSession(user.id, user.role);

  return {
    success: true,
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
      ...tokenData,
    },
  };
}

// ========== 忘记密码 ==========

export async function forgotPassword(target: string): Promise<AuthResult> {
  return sendCode({ target, type: 'reset' });
}

// ========== 重置密码 ==========

interface ResetPasswordInput {
  target: string;
  code: string;
  newPassword: string;
}

export async function resetPassword(input: ResetPasswordInput): Promise<AuthResult> {
  const { target, code, newPassword } = input;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: '密码长度不能少于 8 位' };
  }

  // 校验验证码
  const storedCode = await getVerifyCode('reset', target);
  if (!storedCode || storedCode !== code) {
    return { success: false, message: '验证码错误或已过期' };
  }

  // 查找用户
  const isEmailTarget = isEmail(target);
  const [user] = isEmailTarget
    ? await db.select({ id: users.id }).from(users).where(eq(users.email, target)).limit(1)
    : await db.select({ id: users.id }).from(users).where(eq(users.phone, target)).limit(1);

  if (!user) {
    return { success: false, message: '该账号不存在' };
  }

  // 更新密码
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));

  // 撤销该用户所有活跃会话（强制重新登录）
  await revokeAllSessions(user.id);

  // 清除验证码
  await deleteVerifyCode('reset', target);

  return { success: true, data: { message: '密码重置成功' } };
}

// ========== 退出登录 ==========

export async function logout(token: string): Promise<AuthResult> {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload & { sessionId: string };
    // 撤销该会话
    await db.update(userSessions)
      .set({ isRevoked: true })
      .where(eq(userSessions.id, payload.sessionId));
    return { success: true, data: { message: '退出成功' } };
  } catch {
    // 即使 token 无效也算退出成功（客户端已清理）
    return { success: true, data: { message: '退出成功' } };
  }
}

// ========== 撤销用户所有会话 ==========

async function revokeAllSessions(userId: string): Promise<void> {
  await db.update(userSessions)
    .set({ isRevoked: true })
    .where(eq(userSessions.userId, userId));
}

// ========== 获取用户信息 ==========

export async function getUserProfile(userId: string): Promise<AuthResult> {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      phone: users.phone,
      avatarUrl: users.avatarUrl,
      bio: users.bio,
      role: users.role,
      locale: users.locale,
      theme: users.theme,
      githubId: users.githubId,
      googleId: users.googleId,
      appleId: users.appleId,
      qqId: users.qqId,
      wechatId: users.wechatId,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return { success: false, message: '用户不存在' };
  }

  return { success: true, data: { user } };
}

// ========== 更新用户信息 ==========

interface UpdateProfileInput {
  userId: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  locale?: string;
  theme?: string;
}

export async function updateProfile(input: UpdateProfileInput): Promise<AuthResult> {
  const { userId, ...updates } = input;

  // 如果要更新用户名，检查唯一性
  if (updates.username) {
    const existing = await db.select({ id: users.id }).from(users)
      .where(eq(users.username, updates.username)).limit(1);
    if (existing.length > 0 && existing[0].id !== userId) {
      return { success: false, message: '用户名已被占用' };
    }
  }

  // 过滤掉 undefined 值
  const cleanUpdates: Record<string, any> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) cleanUpdates[key] = value;
  }
  cleanUpdates.updatedAt = new Date();

  await db.update(users).set(cleanUpdates).where(eq(users.id, userId));

  // 返回更新后的用户信息
  return getUserProfile(userId);
}

// ========== 绑定/更换邮箱 ==========

interface BindEmailInput {
  userId: string;
  email: string;
  code: string;
}

export async function bindEmail(input: BindEmailInput): Promise<AuthResult> {
  const { userId, email, code } = input;

  // 校验格式
  if (!isEmail(email)) {
    return { success: false, message: '无效的邮箱格式' };
  }

  // 校验验证码
  const storedCode = await getVerifyCode('bind', email);
  if (!storedCode || storedCode !== code) {
    return { success: false, message: '验证码错误或已过期' };
  }

  // 检查邮箱是否已被其他账号占用
  const existing = await db.select({ id: users.id }).from(users)
    .where(eq(users.email, email)).limit(1);
  if (existing.length > 0 && existing[0].id !== userId) {
    return { success: false, message: '该邮箱已被其他账号绑定' };
  }

  // 执行更新
  await db.update(users).set({ email, updatedAt: new Date() }).where(eq(users.id, userId));
  
  // 清除验证码
  await deleteVerifyCode('bind', email);

  return { success: true, data: { message: '邮箱绑定成功' } };
}

// ========== 绑定/更换手机号 ==========

interface BindPhoneInput {
  userId: string;
  phone: string;
  code: string;
}

export async function bindPhone(input: BindPhoneInput): Promise<AuthResult> {
  const { userId, phone, code } = input;

  // 校验格式
  if (!isPhone(phone)) {
    return { success: false, message: '无效的手机号格式' };
  }

  // 校验验证码
  const storedCode = await getVerifyCode('bind', phone);
  if (!storedCode || storedCode !== code) {
    return { success: false, message: '验证码错误或已过期' };
  }

  // 检查手机号是否已被其他账号占用
  const existing = await db.select({ id: users.id }).from(users)
    .where(eq(users.phone, phone)).limit(1);
  if (existing.length > 0 && existing[0].id !== userId) {
    return { success: false, message: '该手机号已被其他账号绑定' };
  }

  // 执行更新
  await db.update(users).set({ phone, updatedAt: new Date() }).where(eq(users.id, userId));
  
  // 清除验证码
  await deleteVerifyCode('bind', phone);

  return { success: true, data: { message: '手机号绑定成功' } };
}

/**
 * 仅上传头像到 OSS，不更新数据库
 */
export async function uploadAvatarToOss(file: { name: string; buffer: Buffer }): Promise<AuthResult> {
  try {
    const avatarUrl = await ossService.uploadFile('avatars', file.name, file.buffer);
    return { success: true, data: { avatarUrl } };
  } catch (err: any) {
    return { success: false, message: err.message || '头像上传失败' };
  }
}

// ========== 更新头像 (OSS + DB) ==========

export async function updateAvatar(userId: string, file: { name: string; buffer: Buffer }): Promise<AuthResult> {
  try {
    // 1. 上传新头像到 OSS
    const avatarUrl = await ossService.uploadFile('avatars', file.name, file.buffer);

    // 2. 获取旧头像（如果需要删除旧文件，这里可以先查出旧 URL）
    const [user] = await db.select({ avatarUrl: users.avatarUrl }).from(users).where(eq(users.id, userId)).limit(1);

    // 3. 更新数据库
    await db.update(users).set({ avatarUrl, updatedAt: new Date() }).where(eq(users.id, userId));

    // 4. (可选) 删除旧头像，注意如果是默认头像或他人头像不建议删除
    if (user?.avatarUrl && user.avatarUrl.includes(env.OSS_BUCKET_NAME)) {
      try {
        const oldKey = user.avatarUrl.split('.com/')[1];
        if (oldKey) await ossService.deleteFile(oldKey);
      } catch (err) {
        console.warn('[Avatar] Failed to delete old avatar:', err);
      }
    }

    return { success: true, data: { avatarUrl } };
  } catch (err: any) {
    return { success: false, message: err.message || '头像上传失败' };
  }
}


// ========== 修改密码 ==========

interface ChangePasswordInput {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export async function changePassword(input: ChangePasswordInput): Promise<AuthResult> {
  const { userId, oldPassword, newPassword } = input;

  if (!newPassword || newPassword.length < 8) {
    return { success: false, message: '新密码长度不能少于 8 位' };
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { success: false, message: '用户不存在' };

  if (!user.passwordHash) {
    return { success: false, message: '该账户未设置密码' };
  }

  const valid = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!valid) {
    return { success: false, message: '原密码错误' };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, userId));

  return { success: true, data: { message: '密码修改成功' } };
}

// ========== 刷新 Token ==========

export async function refreshToken(token: string): Promise<AuthResult> {
  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; sessionId: string };

    // 检查会话是否有效
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, payload.sessionId))
      .limit(1);

    if (!session || session.isRevoked || new Date() > session.expiresAt) {
      return { success: false, message: '会话已过期，请重新登录' };
    }

    // 查找用户
    const [user] = await db
      .select({ id: users.id, role: users.role, username: users.username, avatarUrl: users.avatarUrl })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    // 生成新的 Access Token
    const accessToken = signAccessToken({ userId: user.id, role: user.role });

    return {
      success: true,
      data: { accessToken, user },
    };
  } catch {
    return { success: false, message: '无效的 Token' };
  }
}

// ========== 创建会话 ==========

async function createSession(userId: string, role: string) {
  // 计算过期时间（7 天）
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // 创建会话记录
  const [session] = await db.insert(userSessions).values({
    userId,
    refreshTokenHash: '', // 临时占位，下面会更新
    expiresAt,
  }).returning({ id: userSessions.id });

  // 生成 token
  const accessToken = signAccessToken({ userId, role });
  const refreshTokenValue = signRefreshToken({ userId, sessionId: session.id });

  // 更新 refreshTokenHash
  const tokenHash = await bcrypt.hash(refreshTokenValue, 8);
  await db.update(userSessions).set({ refreshTokenHash: tokenHash }).where(eq(userSessions.id, session.id));

  return { accessToken, refreshToken: refreshTokenValue };
}
