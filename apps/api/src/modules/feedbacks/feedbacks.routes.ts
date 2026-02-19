import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { createFeedback } from './feedbacks.service';

const app = new OpenAPIHono();

const createFeedbackSchema = z.object({
  problemId: z.string().uuid(),
  errorType: z.enum(['answer_wrong', 'content_error', 'typo', 'other']),
  description: z.string().min(1).max(1000),
});

const createFeedbackRoute = createRoute({
  method: 'post',
  path: '/',
  summary: '提交题目反馈',
  tags: ['Feedback'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createFeedbackSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: '反馈提交成功',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            id: z.string(),
          }),
        },
      },
    },
    401: { description: '未登录' },
  },
});

app.openapi(createFeedbackRoute, async (c) => {
  const userId = c.req.header('X-User-Id');
  if (!userId) {
    return c.json({ success: false, message: '未登录' }, 401);
  }
  
  const body = c.req.valid('json');
  
  try {
    const feedback = await createFeedback({
      userId: userId,
      problemId: body.problemId,
      errorType: body.errorType,
      description: body.description,
    });
    
    return c.json({ success: true, id: feedback.id });
  } catch (error: any) {
    console.error('反馈提交失败:', error);
    return c.json({ 
      success: false, 
      message: error?.detail || error?.message || '提交失败，请稍后重试' 
    }, 500);
  }
});

export default app;
