import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { ToolItemSchema, ErrorSchema } from '../../openapi/schemas';
import { ToolsService } from './tools.service';

const app = new OpenAPIHono();

const ToolsListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(ToolItemSchema),
});

const routeList = createRoute({
  method: 'get',
  path: '/',
  summary: '获取所有精选资源',
  description: '返回所有 LaTeX 工具与学习资源推荐列表（带缓存）',
  responses: {
    200: {
      content: { 'application/json': { schema: ToolsListResponseSchema } },
      description: '成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

const routeByCategory = createRoute({
  method: 'get',
  path: '/{category}',
  summary: '按分类获取资源',
  description: '按分类（如 editor / plugin / online / other）获取资源列表',
  request: {
    params: z.object({
      category: z.string().openapi({ param: { name: 'category', in: 'path' }, example: 'online' }),
    }),
  },
  responses: {
    200: {
      content: { 'application/json': { schema: ToolsListResponseSchema } },
      description: '成功',
    },
    500: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: '服务器错误',
    },
  },
});

app.openapi(routeList, async (c) => {
  try {
    const tools = await ToolsService.getAllTools();
    const data = tools.map((t) => ({
      ...t,
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : null,
    }));
    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error('Failed to fetch tools:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

app.openapi(routeByCategory, async (c) => {
  const { category } = c.req.valid('param');
  try {
    const tools = await ToolsService.getToolsByCategory(category);
    const data = tools.map((t) => ({
      ...t,
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : null,
    }));
    return c.json({ success: true, data }, 200);
  } catch (error) {
    console.error(`Failed to fetch tools for category ${category}:`, error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

export default app;
