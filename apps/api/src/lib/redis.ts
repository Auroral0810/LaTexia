import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl);

redis.on('error', (err: Error) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

/**
 * 缓存包装函数
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 24 * 60 * 60
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      console.log(`[Cache Hit] Key: ${key}`);
      return JSON.parse(cached) as T;
    }

    console.log(`[Cache Miss] Key: ${key}. Fetching from DB...`);
    const data = await fetcher();
    
    // 异步写入缓存
    redis.set(key, JSON.stringify(data), 'EX', ttl).catch((err: Error) => {
      console.error(`Failed to set cache for key ${key}:`, err);
    });

    return data;
  } catch (error: any) {
    console.error(`Redis error for key ${key}:`, error);
    return fetcher();
  }
}
