import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { FormulaExercisesService } from './formula-exercises.service';

const app = new OpenAPIHono();

const FormulaItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  latex: z.string(),
  difficulty: z.string(),
  category: z.string(),
  hint: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  sortOrder: z.number().nullable().optional(),
  attemptCount: z.number().nullable().optional(),
  correctCount: z.number().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  updatedAt: z.string().nullable().optional(),
});

const ErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

// GET /api/formula-exercises/random?difficulty=easy&limit=10
const routeRandom = createRoute({
  method: 'get',
  path: '/random',
  summary: '随机获取公式训练题目',
  description: '按难度随机获取指定数量的已发布题目，供前端公式训练使用（无需登录）',
  request: {
    query: z.object({
      difficulty: z.string().optional().openapi({ param: { name: 'difficulty', in: 'query' }, example: 'easy' }),
      limit: z.string().optional().openapi({ param: { name: 'limit', in: 'query' }, example: '10' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(FormulaItemSchema) }) } },
      description: '成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

// GET /api/formula-exercises — 管理用，获取全部
const routeAll = createRoute({
  method: 'get',
  path: '/',
  summary: '获取所有公式训练题目',
  description: '管理后台用，返回所有题目（含未发布）',
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(FormulaItemSchema) }) } },
      description: '成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

// POST /api/formula-exercises — 新建
const routeCreate = createRoute({
  method: 'post',
  path: '/',
  summary: '新建公式训练题目',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            title: z.string(),
            latex: z.string(),
            difficulty: z.string(),
            category: z.string(),
            hint: z.string().optional(),
            status: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ success: z.literal(true), data: FormulaItemSchema }) } },
      description: '创建成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

// PUT /api/formula-exercises/:id — 更新
const routeUpdate = createRoute({
  method: 'put',
  path: '/{id}',
  summary: '更新公式训练题目',
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            title: z.string().optional(),
            latex: z.string().optional(),
            difficulty: z.string().optional(),
            category: z.string().optional(),
            hint: z.string().optional(),
            status: z.string().optional(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ success: z.literal(true), data: FormulaItemSchema }) } },
      description: '更新成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

// DELETE /api/formula-exercises/:id
const routeDelete = createRoute({
  method: 'delete',
  path: '/{id}',
  summary: '删除公式训练题目',
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ success: z.literal(true), message: z.string() }) } },
      description: '删除成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

// POST /api/formula-exercises/:id/attempt — 上报练习结果（统计用）
const routeAttempt = createRoute({
  method: 'post',
  path: '/{id}/attempt',
  summary: '上报练习结果',
  description: '用户提交后上报练习结果，更新题目的练习次数和正确次数',
  request: {
    params: z.object({
      id: z.string().openapi({ param: { name: 'id', in: 'path' }, example: '1' }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            correct: z.boolean(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: z.object({ success: z.literal(true) }) } },
      description: '上报成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

// ===== handlers =====

app.openapi(routeRandom, async (c) => {
  try {
    const difficulty = c.req.query('difficulty') || 'all';
    const limit = Number(c.req.query('limit')) || 10;
    const data = await FormulaExercisesService.getRandom(difficulty, Math.min(limit, 50));
    const result = data.map((d) => ({
      ...d,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
    }));
    return c.json({ success: true, data: result }, 200);
  } catch (error) {
    console.error('Failed to fetch random formula exercises:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

app.openapi(routeAll, async (c) => {
  try {
    const data = await FormulaExercisesService.getAll();
    const result = data.map((d) => ({
      ...d,
      createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : null,
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
    }));
    return c.json({ success: true, data: result }, 200);
  } catch (error) {
    console.error('Failed to fetch formula exercises:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

app.openapi(routeCreate, async (c) => {
  try {
    const body = await c.req.json();
    const item = await FormulaExercisesService.create(body);
    const result = {
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    };
    return c.json({ success: true, data: result }, 200);
  } catch (error) {
    console.error('Failed to create formula exercise:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

app.openapi(routeUpdate, async (c) => {
  try {
    const id = Number(c.req.valid('param').id);
    const body = await c.req.json();
    const item = await FormulaExercisesService.update(id, body);
    if (!item) return c.json({ success: false, message: 'Not found' }, 500);
    const result = {
      ...item,
      createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : null,
      updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    };
    return c.json({ success: true, data: result }, 200);
  } catch (error) {
    console.error('Failed to update formula exercise:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

app.openapi(routeDelete, async (c) => {
  try {
    const id = Number(c.req.valid('param').id);
    const item = await FormulaExercisesService.delete(id);
    if (!item) return c.json({ success: false, message: 'Not found' }, 500);
    return c.json({ success: true, message: 'Deleted' }, 200);
  } catch (error) {
    console.error('Failed to delete formula exercise:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

app.openapi(routeAttempt, async (c) => {
  try {
    const id = Number(c.req.valid('param').id);
    const body = await c.req.json();
    await FormulaExercisesService.incrementAttempt(id, !!body.correct);
    return c.json({ success: true }, 200);
  } catch (error) {
    console.error('Failed to record attempt:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

export default app;
