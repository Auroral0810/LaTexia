import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { db } from './db';
import { users } from './db/schema/users';

import toolsOpenApiRouter from './modules/tools/tools.openapi';
import symbolsOpenApiRouter from './modules/symbols/symbols.openapi';
import formulaExercisesRouter from './modules/formula-exercises/formula-exercises.openapi';
import authRouter from './modules/auth/auth.routes';
import problemsRouter from './modules/problems/problems.routes';
import statsRouter from './modules/users/stats.routes';
import feedbacksRouter from './modules/feedbacks/feedbacks.routes';
import bookmarksRouter from './modules/bookmarks/bookmarks.routes';
import dailyRouter from './modules/daily/daily.routes';

const app = new OpenAPIHono();

// 中间件
app.use('*', logger());
app.use('*', cors());

// 路由注册（OpenAPI 文档会自动包含这些接口）
app.route('/api/tools', toolsOpenApiRouter);
app.route('/api/symbols', symbolsOpenApiRouter);
app.route('/api/formula-exercises', formulaExercisesRouter);
app.route('/api/auth', authRouter);
app.route('/api/problems', problemsRouter);
app.route('/api/users/stats', statsRouter);
app.route('/api/feedbacks', feedbacksRouter);
app.route('/api/bookmarks', bookmarksRouter);
app.route('/api/daily', dailyRouter);

// 根路径与健康检查（加入 OpenAPI 文档）
const routeRoot = createRoute({
  method: 'get',
  path: '/',
  summary: 'API 欢迎',
  description: '获取 API 基本状态与欢迎信息',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            message: z.string(),
            status: z.string(),
            timestamp: z.string(),
          }),
        },
      },
      description: '成功',
    },
  },
});

const routeHealthDb = createRoute({
  method: 'get',
  path: '/health/db',
  summary: '数据库健康检查',
  description: '检查数据库连接是否正常',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            message: z.string(),
            schema_sample: z.array(z.any()).optional(),
          }),
        },
      },
      description: '连接成功',
    },
    500: {
      content: {
        'application/json': {
          schema: z.object({
            status: z.string(),
            message: z.string(),
            error: z.string(),
          }),
        },
      },
      description: '连接失败',
    },
  },
});

app.openapi(routeRoot, (c) =>
  c.json({
    message: 'Welcome to Latexia API',
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
);

app.openapi(routeHealthDb, async (c) => {
  try {
    const userCount = await db.select().from(users).limit(1);
    return c.json({
      status: 'connected',
      message: 'Database connection successful',
      schema_sample: userCount,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Database connection error:', error);
    return c.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: message,
      },
      500
    );
  }
});

// OpenAPI JSON 规范（供 Swagger UI 等消费）
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    title: 'Latexia API',
    version: '1.0.0',
    description: 'Latexia 在线 LaTeX 学习与练习平台后端接口',
  },
  servers: [{ url: 'http://localhost:3001', description: '本地开发' }],
});

// Swagger UI 页面（固定 5.9 版本，避免 CDN latest 导致 “missing required error components”）
app.get('/doc/ui', swaggerUI({ url: '/doc', version: '5.9.0' }));

const port = 3001;
console.log(`Server is running on http://localhost:${port}`);
console.log(`API 文档 JSON: http://localhost:${port}/doc`);
console.log(`Swagger UI:    http://localhost:${port}/doc/ui`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
