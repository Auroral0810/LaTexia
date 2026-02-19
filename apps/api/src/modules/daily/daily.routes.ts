import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as dailyService from './daily.service';

const dailyRouter = new OpenAPIHono();

const SuccessResponse = z.object({
  success: z.literal(true),
  data: z.any(),
});

const ErrorResponse = z.object({
  success: z.literal(false),
  message: z.string(),
});

const getDailyRoute = createRoute({
  method: 'get',
  path: '/',
  summary: '获取每日一题',
  tags: ['Daily'],
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SuccessResponse,
        },
      },
      description: '获取成功',
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorResponse,
        },
      },
      description: '服务器错误',
    },
  },
});

dailyRouter.openapi(getDailyRoute, async (c) => {
  try {
    const problem = await dailyService.getDailyProblem();
    return c.json({ success: true as const, data: problem }, 200);
  } catch (error: any) {
    return c.json({ success: false as const, message: error?.message || '获取每日一题失败' }, 500);
  }
});

export default dailyRouter;
