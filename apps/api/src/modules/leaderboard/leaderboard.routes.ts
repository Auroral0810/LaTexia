import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as leaderboardService from './leaderboard.service';

const leaderboardRouter = new OpenAPIHono();

const SuccessResponse = z.object({
  success: z.literal(true),
  data: z.array(z.any()),
});

const ErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

const getLeaderboardRoute = createRoute({
  method: 'get',
  path: '/',
  summary: '获取排行榜数据',
  tags: ['Leaderboard'],
  request: {
    query: z.object({
      type: z.enum(['daily', 'weekly', 'monthly', 'all_time']).default('all_time'),
      key: z.string().optional().default('all'),
      limit: z.string().optional().default('50'),
    }),
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '获取成功' },
    500: { content: { 'application/json': { schema: ErrorResponse } }, description: '服务器错误' },
  },
});

const refreshRoute = createRoute({
  method: 'post',
  path: '/refresh',
  summary: '手动刷新排行榜快照（仅限内部/管理员）',
  tags: ['Leaderboard'],
  responses: {
    200: { content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } }, description: '刷新成功' },
    500: { content: { 'application/json': { schema: ErrorResponse } }, description: '刷新失败' },
  },
});

leaderboardRouter.openapi(getLeaderboardRoute, async (c) => {
  const { type, key, limit } = c.req.valid('query');
  try {
    const data = await leaderboardService.getLeaderboard({
      periodType: type as any,
      periodKey: key || 'all',
      limit: parseInt(limit || '50'),
    });
    return c.json({ success: true as const, data }, 200);
  } catch (error: any) {
    return c.json({ success: false as const, message: error?.message || '获取失败' }, 500);
  }
});

leaderboardRouter.openapi(refreshRoute, async (c) => {
  try {
    await leaderboardService.refreshSnapshots();
    return c.json({ success: true as const }, 200);
  } catch (error: any) {
    return c.json({ success: false as const, message: error?.message || '刷新失败' }, 500);
  }
});


export default leaderboardRouter;
