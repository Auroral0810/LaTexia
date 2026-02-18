import { db } from '../../db';
import { toolRecommendations } from '../../db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { withCache } from '../../lib/redis';

export class ToolsService {
  /**
   * 获取所有资源推荐列表（带缓存）
   */
  static async getAllTools() {
    return withCache('latexia:tools:all', async () => {
      return await db
        .select()
        .from(toolRecommendations)
        .orderBy(desc(toolRecommendations.isFeatured), toolRecommendations.sortOrder);
    });
  }

  /**
   * 按分类获取资源
   */
  static async getToolsByCategory(category: string) {
    const cacheKey = `latexia:tools:cat:${category}`;
    return withCache(cacheKey, async () => {
      return await db
        .select()
        .from(toolRecommendations)
        .where(eq(toolRecommendations.category, category))
        .orderBy(desc(toolRecommendations.isFeatured), toolRecommendations.sortOrder);
    });
  }

  /**
   * 刷新缓存
   */
  static async clearCache() {
    // 简单地清理所有相关缓存键
    // 实际生产中可能需要更精细的模式匹配清理
    const keys = await db.select({ id: toolRecommendations.id }).from(toolRecommendations);
    // 这里暂时只处理全量缓存的清除
    const pipeline = db.transaction(async (tx) => {
       // Drizzle 不管 Redis，这里只是占位逻辑
    });
    // 直接操作 Redis
    const { redis } = await import('../../lib/redis');
    await redis.del('latexia:tools:all');
  }
}
