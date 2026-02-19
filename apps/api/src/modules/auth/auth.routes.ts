import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import * as authService from './auth.service';

const authRouter = new OpenAPIHono();

// ========== 通用响应 Schema ==========

const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
});

const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
});

// ========== 1. 发送验证码 ==========

const sendCodeRoute = createRoute({
  method: 'post',
  path: '/send-code',
  summary: '发送验证码',
  description: '向邮箱或手机号发送 6 位数字验证码（邮箱真实发送，手机模拟）',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            target: z.string().min(1).openapi({ description: '邮箱或手机号', example: 'user@example.com' }),
            type: z.enum(['register', 'login', 'reset']).openapi({ description: '验证码用途' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '发送成功' },
    400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '请求错误' },
  },
});

authRouter.openapi(sendCodeRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await authService.sendCode(body);
  if (!result.success) {
    return c.json(result, 400);
  }
  return c.json(result, 200);
});

// ========== 2. 注册 ==========

const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  summary: '用户注册',
  description: '通过邮箱或手机号注册新用户，需提供验证码',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            username: z.string().min(2).max(50).openapi({ description: '用户名', example: 'latex_master' }),
            target: z.string().min(1).openapi({ description: '邮箱或手机号' }),
            code: z.string().length(6).openapi({ description: '6位验证码' }),
            password: z.string().min(8).openapi({ description: '密码（至少8位）' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '注册成功' },
    400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '注册失败' },
  },
});

authRouter.openapi(registerRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await authService.register(body);
  if (!result.success) {
    return c.json(result, 400);
  }
  return c.json(result, 200);
});

// ========== 3. 密码登录 ==========

const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  summary: '密码登录',
  description: '使用用户名/邮箱/手机号 + 密码登录',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            identifier: z.string().min(1).openapi({ description: '用户名/邮箱/手机号' }),
            password: z.string().min(1).openapi({ description: '密码' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '登录成功' },
    400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '登录失败' },
  },
});

authRouter.openapi(loginRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await authService.loginByPassword(body);
  if (!result.success) {
    return c.json(result, 400);
  }
  return c.json(result, 200);
});

// ========== 4. 验证码登录 ==========

const loginByCodeRoute = createRoute({
  method: 'post',
  path: '/login/code',
  summary: '验证码登录',
  description: '使用邮箱或手机号 + 验证码登录',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            target: z.string().min(1).openapi({ description: '邮箱或手机号' }),
            code: z.string().length(6).openapi({ description: '6位验证码' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '登录成功' },
    400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '登录失败' },
  },
});

authRouter.openapi(loginByCodeRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await authService.loginByCode(body);
  if (!result.success) {
    return c.json(result, 400);
  }
  return c.json(result, 200);
});

// ========== 5. 忘记密码 ==========

const forgotPasswordRoute = createRoute({
  method: 'post',
  path: '/forgot-password',
  summary: '发送密码重置验证码',
  description: '向已注册的邮箱或手机号发送密码重置验证码',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            target: z.string().min(1).openapi({ description: '邮箱或手机号' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '发送成功' },
    400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '发送失败' },
  },
});

authRouter.openapi(forgotPasswordRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await authService.forgotPassword(body.target);
  if (!result.success) {
    return c.json(result, 400);
  }
  return c.json(result, 200);
});

// ========== 6. 重置密码 ==========

const resetPasswordRoute = createRoute({
  method: 'post',
  path: '/reset-password',
  summary: '重置密码',
  description: '使用验证码重置密码',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            target: z.string().min(1).openapi({ description: '邮箱或手机号' }),
            code: z.string().length(6).openapi({ description: '6位验证码' }),
            newPassword: z.string().min(8).openapi({ description: '新密码（至少8位）' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '重置成功' },
    400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '重置失败' },
  },
});

authRouter.openapi(resetPasswordRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await authService.resetPassword(body);
  if (!result.success) {
    return c.json(result, 400);
  }
  return c.json(result, 200);
});

// ========== 7. 刷新 Token ==========

const refreshRoute = createRoute({
  method: 'post',
  path: '/refresh',
  summary: '刷新 Access Token',
  description: '使用 Refresh Token 刷新 Access Token',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            refreshToken: z.string().min(1).openapi({ description: 'Refresh Token' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { content: { 'application/json': { schema: SuccessResponseSchema } }, description: '刷新成功' },
    400: { content: { 'application/json': { schema: ErrorResponseSchema } }, description: '刷新失败' },
  },
});

authRouter.openapi(refreshRoute, async (c) => {
  const body = c.req.valid('json');
  const result = await authService.refreshToken(body.refreshToken);
  if (!result.success) {
    return c.json(result, 400);
  }
  return c.json(result, 200);
});

export default authRouter;
