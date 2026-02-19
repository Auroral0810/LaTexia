import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as reviewService from './review.service';

const reviewRouter = new OpenAPIHono();

// ========== 辅助：获取 userId ==========
function getUserId(c: any): string | null {
  return c.req.header('X-User-Id') || null;
}


const SuccessResponse = z.object({
  success: z.literal(true),
  data: z.any().optional(),
});

const ErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

// 获取待复习列表
const getDueListRoute = createRoute({
  method: 'get',
  path: '/list',
  summary: '获取待复习题目列表',
  tags: ['Review'],
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '获取成功' },
    401: { description: '未登录' },
  },
});

// 提交复习结果
const submitReviewRoute = createRoute({
  method: 'post',
  path: '/submit',
  summary: '提交复习结果',
  tags: ['Review'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            problemId: z.string(),
            isCorrect: z.boolean(),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '提交成功' },
    401: { description: '未登录' },
  },
});

// 获取统计数据
const getStatsRoute = createRoute({
  method: 'get',
  path: '/stats',
  summary: '获取复习统计数据',
  tags: ['Review'],
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '获取成功' },
    401: { description: '未登录' },
  },
});

reviewRouter.openapi(getDueListRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  try {
    const data = await reviewService.getDueReviewProblems(userId);
    return c.json({ success: true as const, data }, 200);
  } catch (error: any) {
    return c.json({ success: false as const, message: error.message }, 500);
  }
});

reviewRouter.openapi(submitReviewRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const { problemId, isCorrect } = c.req.valid('json');
  try {
    await reviewService.completeReview(userId, problemId, isCorrect);
    return c.json({ success: true as const }, 200);
  } catch (error: any) {
    return c.json({ success: false as const, message: error.message }, 500);
  }
});

reviewRouter.openapi(getStatsRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  try {
    const data = await reviewService.getReviewStats(userId);
    return c.json({ success: true as const, data }, 200);
  } catch (error: any) {
    return c.json({ success: false as const, message: error.message }, 500);
  }
});


export default reviewRouter;
