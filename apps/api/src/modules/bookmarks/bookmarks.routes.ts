import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as bookmarksService from './bookmarks.service';

const bookmarksRouter = new OpenAPIHono();

// ========== 通用响应 Schema ==========

const SuccessResponse = z.object({ success: z.literal(true), data: z.any() });
const ErrorResponse = z.object({ success: z.literal(false), message: z.string() });

// ========== 辅助：获取 userId ==========
function getUserId(c: any): string | null {
  return c.req.header('X-User-Id') || null;
}

// ========== 1. 收藏/取消收藏 ==========

const toggleRoute = createRoute({
  method: 'post',
  path: '/toggle',
  summary: '收藏/取消收藏题目',
  tags: ['Bookmarks'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            problemId: z.string().uuid(),
            folderId: z.string().uuid().optional(),
          }),
        },
      },
      required: true,
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '操作成功' },
    401: { content: { 'application/json': { schema: ErrorResponse } }, description: '未登录' },
    500: { content: { 'application/json': { schema: ErrorResponse } }, description: '服务器错误' },
  },
});

bookmarksRouter.openapi(toggleRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const { problemId, folderId } = c.req.valid('json');
  try {
    const result = await bookmarksService.toggleBookmark(userId, problemId, folderId);
    return c.json({ success: true as const, data: result }, 200);
  } catch (error: any) {
    return c.json({ success: false as const, message: error?.message || '操作失败' }, 500);
  }
});

// ========== 2. 检查是否已收藏 ==========

const checkRoute = createRoute({
  method: 'get',
  path: '/check/{problemId}',
  summary: '检查题目是否已收藏',
  tags: ['Bookmarks'],
  request: {
    params: z.object({ problemId: z.string().uuid() }),
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '查询成功' },
    401: { content: { 'application/json': { schema: ErrorResponse } }, description: '未登录' },
  },
});

bookmarksRouter.openapi(checkRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const { problemId } = c.req.valid('param');
  const bookmarked = await bookmarksService.isBookmarked(userId, problemId);
  return c.json({ success: true as const, data: { bookmarked } }, 200);
});

// ========== 3. 获取收藏列表 ==========

const listRoute = createRoute({
  method: 'get',
  path: '/',
  summary: '获取收藏列表',
  tags: ['Bookmarks'],
  request: {
    query: z.object({
      folderId: z.string().optional(),
      page: z.string().optional().default('1'),
      pageSize: z.string().optional().default('20'),
    }),
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '获取成功' },
    401: { content: { 'application/json': { schema: ErrorResponse } }, description: '未登录' },
  },
});

bookmarksRouter.openapi(listRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const { folderId, page, pageSize } = c.req.valid('query');
  const result = await bookmarksService.getBookmarks(
    userId,
    folderId,
    parseInt(page),
    parseInt(pageSize),
  );
  return c.json({ success: true as const, data: result }, 200);
});

// ========== 4. 获取收藏夹列表 ==========

const foldersRoute = createRoute({
  method: 'get',
  path: '/folders',
  summary: '获取收藏夹列表',
  tags: ['Bookmarks'],
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '获取成功' },
    401: { content: { 'application/json': { schema: ErrorResponse } }, description: '未登录' },
  },
});

bookmarksRouter.openapi(foldersRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const result = await bookmarksService.getFolders(userId);
  return c.json({ success: true as const, data: result }, 200);
});

// ========== 5. 创建收藏夹 ==========

const createFolderRoute = createRoute({
  method: 'post',
  path: '/folders',
  summary: '创建收藏夹',
  tags: ['Bookmarks'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ name: z.string().min(1).max(100) }),
        },
      },
      required: true,
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '创建成功' },
    401: { content: { 'application/json': { schema: ErrorResponse } }, description: '未登录' },
  },
});

bookmarksRouter.openapi(createFolderRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const { name } = c.req.valid('json');
  const folder = await bookmarksService.createFolder(userId, name);
  return c.json({ success: true as const, data: folder }, 200);
});

// ========== 6. 重命名收藏夹 ==========

const updateFolderRoute = createRoute({
  method: 'put',
  path: '/folders/{id}',
  summary: '重命名收藏夹',
  tags: ['Bookmarks'],
  request: {
    params: z.object({ id: z.string().uuid() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({ name: z.string().min(1).max(100) }),
        },
      },
      required: true,
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '更新成功' },
    401: { content: { 'application/json': { schema: ErrorResponse } }, description: '未登录' },
  },
});

bookmarksRouter.openapi(updateFolderRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const { id } = c.req.valid('param');
  const { name } = c.req.valid('json');
  const folder = await bookmarksService.updateFolder(userId, id, name);
  return c.json({ success: true as const, data: folder }, 200);
});

// ========== 7. 删除收藏夹 ==========

const deleteFolderRoute = createRoute({
  method: 'delete',
  path: '/folders/{id}',
  summary: '删除收藏夹',
  tags: ['Bookmarks'],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponse } }, description: '删除成功' },
    401: { content: { 'application/json': { schema: ErrorResponse } }, description: '未登录' },
  },
});

bookmarksRouter.openapi(deleteFolderRoute, async (c) => {
  const userId = getUserId(c);
  if (!userId) return c.json({ success: false as const, message: '未登录' }, 401);

  const { id } = c.req.valid('param');
  await bookmarksService.deleteFolder(userId, id);
  return c.json({ success: true as const, data: { deleted: true } }, 200);
});

export default bookmarksRouter;
