import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as learnService from './learn.service';

const learnRouter = new OpenAPIHono();

// ========== Schemas ==========

const ChapterBriefSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  sortOrder: z.number().nullable(),
});

const ChapterTreeSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string(),
  sortOrder: z.number().nullable(),
  sections: z.array(ChapterBriefSchema),
});

const ContentSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().nullable(),
  slug: z.string(),
  parentId: z.number().nullable(),
});

// ========== Routes ==========

// 获取目录树
const getTreeRoute = createRoute({
  method: 'get',
  path: '/tree',
  summary: '获取教学目录树',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: z.array(ChapterTreeSchema),
          }),
        },
      },
      description: '获取成功',
    },
  },
});

learnRouter.openapi(getTreeRoute, async (c) => {
  const tree = await learnService.getChapterTree();
  return c.json({ success: true as const, data: tree }, 200);
});

// 获取详情
const getDetailRoute = createRoute({
  method: 'get',
  path: '/chapters/{slug}',
  summary: '获取章节详情',
  request: {
    params: z.object({
      slug: z.string().openapi({ description: 'Slug' }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(true),
            data: ContentSchema,
          }),
        },
      },
      description: '获取成功',
    },
    404: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.literal(false),
            message: z.string(),
          }),
        },
      },
      description: '未找到',
    },
  },
});

learnRouter.openapi(getDetailRoute, async (c) => {
  const { slug } = c.req.valid('param');
  const details = await learnService.getChapterBySlug(slug);
  if (!details) {
    return c.json({ success: false as const, message: '章节不存在' }, 404);
  }
  return c.json({ success: true as const, data: details }, 200);
});

export default learnRouter;
