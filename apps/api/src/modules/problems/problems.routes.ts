import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as problemsService from './problems.service';

const problemsRouter = new OpenAPIHono();

// ========== Schemas ==========

const TagSchema = z.object({
  id: z.number(),
  name: z.string(),
  color: z.string().nullable(),
});

const ProblemItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'hell']),
  categoryId: z.number().nullable(),
  categoryName: z.string().nullable(),
  attemptCount: z.number().nullable(),
  correctCount: z.number().nullable(),
  tags: z.array(TagSchema),
  status: z.enum(['unstarted', 'attempted', 'solved', 'unknown']),
  createdAt: z.date().or(z.string()),
});

const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  nameEn: z.string().nullable(),
  slug: z.string(),
  parentId: z.number().nullable(),
  icon: z.string().nullable(),
  sortOrder: z.number().nullable(),
});

// ========== Routes ==========

const getProblemsRoute = createRoute({
  method: 'get',
  path: '/',
  summary: '获取题目列表',
  description: '支持多维度过滤、搜索及关联当前用户完成状态',
  request: {
    query: z.object({
      categoryId: z.string().optional().openapi({ description: '分类 ID' }),
      tagId: z.string().optional().openapi({ description: '标签 ID' }),
      difficulty: z.enum(['easy', 'medium', 'hard', 'hell']).optional().openapi({ description: '难度' }),
      search: z.string().optional().openapi({ description: '关键字搜索' }),
      page: z.string().optional().default('1').openapi({ description: '页码' }),
      pageSize: z.string().optional().default('10').openapi({ description: '每页数量' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              items: z.array(ProblemItemSchema),
              total: z.number(),
            }),
          }),
        },
      },
      description: '获取成功',
    },
  },
});

problemsRouter.openapi(getProblemsRoute, async (c) => {
  const query = c.req.valid('query');
  const userId = c.req.header('X-User-Id'); // 临时方案

  const result = await problemsService.getProblems({
    categoryId: query.categoryId ? parseInt(query.categoryId) : undefined,
    tagId: query.tagId ? parseInt(query.tagId) : undefined,
    difficulty: query.difficulty,
    search: query.search,
    page: parseInt(query.page),
    pageSize: parseInt(query.pageSize),
    userId,
  });

  return c.json({ success: true as const, data: result }, 200);
});

const getMetadataRoute = createRoute({
  method: 'get',
  path: '/metadata',
  summary: '获取题库元数据',
  description: '获取分类和标签列表以供筛选',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.object({
              categories: z.array(CategorySchema),
              tags: z.array(TagSchema),
            }),
          }),
        },
      },
      description: '获取成功',
    },
  },
});

problemsRouter.openapi(getMetadataRoute, async (c) => {
  const result = await problemsService.getMetadata();
  return c.json({ success: true as const, data: result }, 200);
});

export default problemsRouter;
