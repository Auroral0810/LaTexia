import { z } from '@hono/zod-openapi';

/** 通用成功响应包装 */
export const SuccessSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true).openapi({ description: '是否成功' }),
    data: dataSchema,
  });

/** 通用错误响应 */
export const ErrorSchema = z
  .object({
    success: z.literal(false),
    message: z.string().openapi({ description: '错误信息' }),
  })
  .openapi('ErrorResponse');

/** 工具推荐项 */
export const ToolItemSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Overleaf' }),
    description: z.string().openapi({ example: '在线协作 LaTeX 编辑器' }),
    url: z.string().url().openapi({ example: 'https://overleaf.com' }),
    category: z.string().openapi({ example: 'online' }),
    logoUrl: z.string().nullable().optional(),
    tags: z.array(z.string()).nullable().optional(),
    isFeatured: z.boolean().nullable().optional(),
    sortOrder: z.number().nullable().optional(),
    level: z.string().nullable().optional(),
    createdBy: z.string().uuid().nullable().optional(),
    createdAt: z.string().nullable().optional(),
  })
  .openapi('ToolItem');

/** 符号项 */
export const SymbolItemSchema = z
  .object({
    id: z.number().openapi({ example: 1 }),
    name: z.string().openapi({ example: 'Alpha' }),
    latexCode: z.string().openapi({ example: '\\alpha' }),
    unicode: z.string().nullable().optional(),
    category: z.string().openapi({ example: 'greek' }),
    description: z.string().nullable().optional(),
    example: z.string().nullable().optional(),
    sortOrder: z.number().nullable().optional(),
  })
  .openapi('SymbolItem');

/** 分页元信息 */
export const PaginationMetaSchema = z
  .object({
    page: z.number().openapi({ example: 1 }),
    limit: z.number().openapi({ example: 50 }),
    total: z.number().openapi({ example: 100 }),
    totalPages: z.number().openapi({ example: 2 }),
  })
  .openapi('PaginationMeta');
