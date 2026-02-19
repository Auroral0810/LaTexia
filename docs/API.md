# Latexia API 文档

本项目的接口文档通过 **OpenAPI 3.0** 自动生成，并提供 **Swagger UI** 在线查看与调试。

## 查看文档

启动后端 API 服务后：

| 地址 | 说明 |
|------|------|
| **http://localhost:3001/doc/ui** | Swagger UI 页面（推荐，可在线调试接口） |
| **http://localhost:3001/doc** | OpenAPI 3.0 JSON 规范（供其他工具消费） |

### 启动方式

```bash
# 在 monorepo 根目录
pnpm --filter @latexia/api dev

# 或进入 api 目录
cd apps/api && pnpm dev
```

服务默认运行在 **http://localhost:3001**。

## 技术栈

- **[@hono/zod-openapi](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)**：基于 Hono + Zod 的 OpenAPI 路由与 Schema 定义，接口与文档同源、类型安全。
- **[@hono/swagger-ui](https://www.npmjs.com/package/@hono/swagger-ui)**：在 `/doc/ui` 提供 Swagger UI 页面。

## 已纳入文档的接口

- `GET /` — API 欢迎信息
- `GET /health/db` — 数据库健康检查
- `GET /api/tools` — 获取所有精选资源
- `GET /api/tools/{category}` — 按分类获取资源
- `GET /api/symbols` — 获取 LaTeX 符号列表（支持 `page`、`limit`、`category`、`q` 查询参数）

新增或修改接口时，在对应模块的 `*.openapi.ts` 中通过 `createRoute` 定义路由与 Schema，文档会自动更新。
