import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { SymbolItemSchema, PaginationMetaSchema, ErrorSchema } from '../../openapi/schemas';
import { SymbolsService } from './symbols.service';

const app = new OpenAPIHono();

const SymbolsQuerySchema = z.object({
  page: z.string().optional().openapi({ param: { name: 'page', in: 'query' }, example: '1' }),
  limit: z.string().optional().openapi({ param: { name: 'limit', in: 'query' }, example: '50' }),
  category: z.string().optional().openapi({ param: { name: 'category', in: 'query' }, example: 'math' }),
  q: z.string().optional().openapi({ param: { name: 'q', in: 'query' }, description: '搜索关键词' }),
});

const SymbolsListResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(SymbolItemSchema),
  meta: PaginationMetaSchema,
});

const routeList = createRoute({
  method: 'get',
  path: '/',
  summary: '获取 LaTeX 符号列表',
  description: '分页获取符号，支持按分类与关键词筛选。Query: page, limit, category, q',
  request: {
    query: SymbolsQuerySchema,
  },
  responses: {
    200: {
      content: { 'application/json': { schema: SymbolsListResponseSchema } },
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
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 50;
    const category = c.req.query('category');
    const q = c.req.query('q');
    const result = await SymbolsService.getSymbols(page, limit, category, q);
    return c.json(
      {
        success: true,
        data: result.data,
        meta: result.meta,
      },
      200
    );
  } catch (error) {
    console.error('Failed to fetch symbols:', error);
    return c.json({ success: false, message: 'Internal Server Error' }, 500);
  }
});

export default app;
