import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { db } from './db';
import { users } from './db/schema/users';

import toolsRouter from './modules/tools/tools.routes';
import symbolsRouter from './modules/symbols/symbols.routes';

const app = new Hono();

// 中间件
app.use('*', logger());
app.use('*', cors());

// 路由注册
app.route('/api/tools', toolsRouter);
app.route('/api/symbols', symbolsRouter);

// 健康检查
app.get('/', (c) => {
  return c.json({
    message: 'Welcome to Latexia API',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 测试数据库连接
app.get('/health/db', async (c) => {
  try {
    const userCount = await db.select().from(users).limit(1);
    return c.json({
      status: 'connected',
      message: 'Database connection successful',
      schema_sample: userCount,
    });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return c.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    }, 500);
  }
});

const port = 3001;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});

export default app;
