import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as statsService from './stats.service';

const statsRouter = new OpenAPIHono();

const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
});

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

// 1. 获取学习概览统计
const getSummaryRoute = createRoute({
  method: 'get',
  path: '/summary',
  summary: '获取学习概览统计',
  description: '获取练习数、准确率、连续打卡天数等摘要数据',
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '获取成功' },
    401: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '未授权' },
  },
});

statsRouter.openapi(getSummaryRoute, async (c) => {
  const userId = c.req.header('X-User-Id');
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const data = await statsService.getStatsSummary(userId);
  return c.json({ success: true as const, data }, 200);
});

// 2. 获取活跃度热力图数据
const getHeatmapRoute = createRoute({
  method: 'get',
  path: '/heatmap',
  summary: '获取活跃度热力图',
  request: {
    query: z.object({
      year: z.string().optional().describe('要查询的年份，不传则为近一年'),
    }),
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '获取成功' },
    401: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '未授权' },
  },
});

statsRouter.openapi(getHeatmapRoute, async (c) => {
  const userId = c.req.header('X-User-Id');
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const queryYear = c.req.query('year');
  const year = queryYear ? parseInt(queryYear) : undefined;

  const data = await statsService.getHeatmapData(userId, year);
  return c.json({ success: true as const, data }, 200);
});

// 3. 获取最近活动日志
const getActivityLogsRoute = createRoute({
  method: 'get',
  path: '/activity',
  summary: '获取最近活动日志',
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '获取成功' },
    401: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '未授权' },
  },
});

statsRouter.openapi(getActivityLogsRoute, async (c) => {
  const userId = c.req.header('X-User-Id');
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const data = await statsService.getActivityLogs(userId);
  return c.json({ success: true as const, data }, 200);
});

// 4. 获取技能进度统计
const getSkillProgressRoute = createRoute({
  method: 'get',
  path: '/skill',
  summary: '获取技能进度统计',
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '获取成功' },
    401: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '未授权' },
  },
});

statsRouter.openapi(getSkillProgressRoute, async (c) => {
  const userId = c.req.header('X-User-Id');
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const data = await statsService.getSkillProgress(userId);
  return c.json({ success: true as const, data }, 200);
});

export default statsRouter;
