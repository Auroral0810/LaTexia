import Redis from 'ioredis';
import { env } from './env';

/** 验证码有效期（秒） */
const CODE_TTL = 300; // 5 分钟

/** 同一目标发送间隔（秒），防止频繁发送 */
const CODE_INTERVAL = 60; // 1 分钟

// ========== Redis 客户端 ==========

let redis: Redis | null = null;
/** 内存降级存储（Redis 不可用时） */
const memoryStore = new Map<string, { value: string; expiresAt: number }>();

/**
 * 获取 Redis 客户端（懒初始化）
 */
function getRedis(): Redis | null {
  if (redis) return redis;
  try {
    redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 2 ? null : Math.min(times * 200, 1000)),
      lazyConnect: true,
    });
    redis.on('error', (err) => {
      console.warn('[Redis] 连接失败，降级为内存存储:', err.message);
      redis = null;
    });
    redis.connect().catch(() => {
      redis = null;
    });
    return redis;
  } catch {
    console.warn('[Redis] 初始化失败，使用内存存储');
    return null;
  }
}

// ========== 验证码存取 ==========

/**
 * 生成验证码 key
 * @param type 用途：register / login / reset
 * @param target 邮箱或手机号
 */
function codeKey(type: string, target: string): string {
  return `verify:${type}:${target}`;
}

/** 频率限制 key */
function intervalKey(type: string, target: string): string {
  return `verify:interval:${type}:${target}`;
}

/**
 * 存储验证码
 */
export async function setVerifyCode(type: string, target: string, code: string): Promise<void> {
  const r = getRedis();
  if (r) {
    const pipeline = r.pipeline();
    pipeline.setex(codeKey(type, target), CODE_TTL, code);
    pipeline.setex(intervalKey(type, target), CODE_INTERVAL, '1');
    await pipeline.exec();
  } else {
    const now = Date.now();
    memoryStore.set(codeKey(type, target), { value: code, expiresAt: now + CODE_TTL * 1000 });
    memoryStore.set(intervalKey(type, target), { value: '1', expiresAt: now + CODE_INTERVAL * 1000 });
  }
}

/**
 * 获取验证码
 */
export async function getVerifyCode(type: string, target: string): Promise<string | null> {
  const r = getRedis();
  if (r) {
    return r.get(codeKey(type, target));
  }
  const entry = memoryStore.get(codeKey(type, target));
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(codeKey(type, target));
    return null;
  }
  return entry.value;
}

/**
 * 删除验证码（验证通过后）
 */
export async function deleteVerifyCode(type: string, target: string): Promise<void> {
  const r = getRedis();
  if (r) {
    await r.del(codeKey(type, target));
  } else {
    memoryStore.delete(codeKey(type, target));
  }
}

/**
 * 检查是否在发送间隔内
 */
export async function isInCooldown(type: string, target: string): Promise<boolean> {
  const r = getRedis();
  if (r) {
    const val = await r.get(intervalKey(type, target));
    return val !== null;
  }
  const entry = memoryStore.get(intervalKey(type, target));
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    memoryStore.delete(intervalKey(type, target));
    return false;
  }
  return true;
}

/**
 * 生成 6 位数字验证码
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
